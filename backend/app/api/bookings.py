import uuid

from datetime import (
    date,
    datetime,
    time,
    timedelta,
)

from decimal import Decimal

from zoneinfo import ZoneInfo

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)

from sqlalchemy import (
    select,
    text,
)

from sqlalchemy.orm import (
    Session,
    selectinload,
)

from app.core.config import settings
from app.db.session import get_db

from app.models.booking import Booking
from app.models.client import Client

from app.models.enums import (
    BookingStatus,
    PaymentType,
)

from app.models.payment import Payment

from app.models.rental_package import (
    RentalPackage,
)

from app.schemas.booking import (
    AvailabilityResponse,
    BookingCancel,
    BookingCreate,
    BookingResponse,
    BookingStatusUpdate,
    BookingUpdate,
)

from app.schemas.payment import (
    PaymentCreate,
)

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"],
)


BUSINESS_TIMEZONE = ZoneInfo(settings.business_timezone)


def get_booking_statement():
    return select(Booking).options(
        selectinload(Booking.client),
        selectinload(Booking.rental_package),
        selectinload(Booking.payments),
    )


def get_booking_or_404(
    booking_id: uuid.UUID,
    db: Session,
) -> Booking:
    booking = db.scalar(get_booking_statement().where(Booking.id == booking_id))

    if booking is None:
        raise HTTPException(
            status_code=404,
            detail="Reservación no encontrada.",
        )

    return booking


def build_booking_times(
    event_date: date,
    start_time: time,
    duration_hours: int,
) -> tuple[datetime, datetime]:

    starts_at = datetime.combine(
        event_date,
        start_time,
        tzinfo=BUSINESS_TIMEZONE,
    )

    ends_at = starts_at + timedelta(hours=duration_hours)

    return starts_at, ends_at


def find_conflicting_booking(
    db: Session,
    starts_at: datetime,
    ends_at: datetime,
    exclude_booking_id: uuid.UUID | None = None,
) -> Booking | None:

    statement = get_booking_statement().where(
        Booking.status != BookingStatus.CANCELLED,
        Booking.starts_at < ends_at,
        Booking.ends_at > starts_at,
    )

    if exclude_booking_id is not None:
        statement = statement.where(Booking.id != exclude_booking_id)

    statement = statement.order_by(Booking.starts_at.asc())

    return db.scalar(statement)


@router.get(
    "",
    response_model=list[BookingResponse],
)
def get_bookings(
    date_from: date | None = Query(default=None),
    date_to: date | None = Query(default=None),
    db: Session = Depends(get_db),
):

    statement = get_booking_statement().order_by(Booking.starts_at.asc())

    if date_from:
        range_start = datetime.combine(
            date_from,
            time.min,
            tzinfo=BUSINESS_TIMEZONE,
        )

        statement = statement.where(Booking.ends_at > range_start)

    if date_to:
        range_end = datetime.combine(
            date_to + timedelta(days=1),
            time.min,
            tzinfo=BUSINESS_TIMEZONE,
        )

        statement = statement.where(Booking.starts_at < range_end)

    return db.scalars(statement).unique().all()


@router.get(
    "/availability",
    response_model=AvailabilityResponse,
)
def check_availability(
    package_id: uuid.UUID,
    event_date: date,
    start_time: time,
    db: Session = Depends(get_db),
):

    rental_package = db.get(
        RentalPackage,
        package_id,
    )

    if rental_package is None or not rental_package.is_active:
        raise HTTPException(
            status_code=404,
            detail="Paquete no encontrado.",
        )

    starts_at, ends_at = build_booking_times(
        event_date,
        start_time,
        rental_package.duration_hours,
    )

    conflict = find_conflicting_booking(
        db,
        starts_at,
        ends_at,
    )

    return AvailabilityResponse(
        available=conflict is None,
        starts_at=starts_at,
        ends_at=ends_at,
        conflicting_booking=conflict,
    )


@router.get(
    "/{booking_id}",
    response_model=BookingResponse,
)
def get_booking(
    booking_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    return get_booking_or_404(
        booking_id,
        db,
    )


@router.post(
    "",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_booking(
    data: BookingCreate,
    db: Session = Depends(get_db),
):

    db.execute(text("SELECT " "pg_advisory_xact_lock(91326001)"))

    client = db.get(
        Client,
        data.client_id,
    )

    if client is None or not client.is_active:
        raise HTTPException(
            status_code=404,
            detail="Cliente no encontrado.",
        )

    rental_package = db.get(
        RentalPackage,
        data.package_id,
    )

    if rental_package is None or not rental_package.is_active:
        raise HTTPException(
            status_code=404,
            detail="Paquete no encontrado.",
        )

    starts_at, ends_at = build_booking_times(
        data.event_date,
        data.start_time,
        rental_package.duration_hours,
    )

    conflict = find_conflicting_booking(
        db,
        starts_at,
        ends_at,
    )

    if conflict:
        raise HTTPException(
            status_code=409,
            detail={
                "message": "El horario seleccionado "
                "se empalma con otra reservación.",
                "folio": conflict.folio,
            },
        )

    agreed_price = Decimal(rental_package.base_price)

    if data.discount > agreed_price:
        raise HTTPException(
            status_code=400,
            detail=("El descuento no puede ser " "mayor al precio."),
        )

    final_price = agreed_price - data.discount

    if data.initial_payment_amount > final_price:
        raise HTTPException(
            status_code=400,
            detail=("El anticipo no puede ser " "mayor al total."),
        )

    booking_id = uuid.uuid4()

    folio = f"VI-" f"{starts_at.year}-" f"{booking_id.hex[:8].upper()}"

    if data.initial_payment_amount <= Decimal("0.00"):
        booking_status = BookingStatus.PENDING

    elif data.initial_payment_amount >= final_price:
        booking_status = BookingStatus.PAID

    else:
        booking_status = BookingStatus.RESERVED

    booking = Booking(
        id=booking_id,
        folio=folio,
        client_id=client.id,
        package_id=rental_package.id,
        starts_at=starts_at,
        ends_at=ends_at,
        event_type=data.event_type.strip(),
        guest_count=data.guest_count,
        package_name_snapshot=(rental_package.name),
        agreed_price=agreed_price,
        discount=data.discount,
        status=booking_status,
        notes=(data.notes.strip() if data.notes else None),
    )

    db.add(booking)
    db.flush()

    if data.initial_payment_amount > Decimal("0.00"):

        if data.initial_payment_amount >= final_price:
            payment_type = PaymentType.SETTLEMENT
        else:
            payment_type = PaymentType.DEPOSIT

        payment = Payment(
            booking_id=booking.id,
            amount=(data.initial_payment_amount),
            payment_type=payment_type,
            payment_method=(data.initial_payment_method),
            reference=(data.payment_reference),
            notes=("Pago registrado al crear " "la reservación."),
        )

        db.add(payment)

    db.commit()

    return get_booking_or_404(
        booking.id,
        db,
    )


@router.put(
    "/{booking_id}",
    response_model=BookingResponse,
)
def update_booking(
    booking_id: uuid.UUID,
    data: BookingUpdate,
    db: Session = Depends(get_db),
):

    db.execute(text("SELECT " "pg_advisory_xact_lock(91326001)"))

    booking = get_booking_or_404(
        booking_id,
        db,
    )

    if booking.status == BookingStatus.CANCELLED:
        raise HTTPException(
            status_code=400,
            detail=("No puedes editar una " "reservación cancelada."),
        )

    current_local_start = booking.starts_at.astimezone(BUSINESS_TIMEZONE)

    new_client = booking.client

    if data.client_id is not None:
        new_client = db.get(
            Client,
            data.client_id,
        )

        if new_client is None or not new_client.is_active:
            raise HTTPException(
                status_code=404,
                detail="Cliente no encontrado.",
            )

    rental_package = booking.rental_package

    package_changed = False

    if data.package_id is not None and data.package_id != booking.package_id:
        rental_package = db.get(
            RentalPackage,
            data.package_id,
        )

        if rental_package is None or not rental_package.is_active:
            raise HTTPException(
                status_code=404,
                detail="Paquete no encontrado.",
            )

        package_changed = True

    new_date = (
        data.event_date if data.event_date is not None else current_local_start.date()
    )

    new_time = (
        data.start_time
        if data.start_time is not None
        else current_local_start.time().replace(tzinfo=None)
    )

    starts_at, ends_at = build_booking_times(
        new_date,
        new_time,
        rental_package.duration_hours,
    )

    conflict = find_conflicting_booking(
        db,
        starts_at,
        ends_at,
        exclude_booking_id=booking.id,
    )

    if conflict:
        raise HTTPException(
            status_code=409,
            detail={
                "message": "El nuevo horario se empalma " "con otra reservación.",
                "folio": conflict.folio,
            },
        )

    if package_changed:
        new_agreed_price = Decimal(rental_package.base_price)
    else:
        new_agreed_price = booking.agreed_price

    new_discount = data.discount if data.discount is not None else booking.discount

    new_final_price = new_agreed_price - new_discount

    if new_final_price < Decimal("0.00"):
        raise HTTPException(
            status_code=400,
            detail=("El descuento no puede ser " "mayor al precio."),
        )

    if new_final_price < booking.total_paid:
        raise HTTPException(
            status_code=400,
            detail=("El nuevo total no puede ser " "menor al importe ya pagado."),
        )

    booking.client_id = new_client.id

    booking.package_id = rental_package.id

    booking.starts_at = starts_at

    booking.ends_at = ends_at

    if package_changed:
        booking.package_name_snapshot = rental_package.name

        booking.agreed_price = new_agreed_price

    booking.discount = new_discount

    if data.event_type is not None:
        booking.event_type = data.event_type.strip()

    updated_fields = data.model_fields_set

    if "guest_count" in updated_fields:
        booking.guest_count = data.guest_count

    if "notes" in updated_fields:
        booking.notes = (
            data.notes.strip() if data.notes and data.notes.strip() else None
        )

    db.commit()

    return get_booking_or_404(
        booking.id,
        db,
    )


@router.post(
    "/{booking_id}/payments",
    response_model=BookingResponse,
)
def add_payment(
    booking_id: uuid.UUID,
    data: PaymentCreate,
    db: Session = Depends(get_db),
):

    booking = get_booking_or_404(
        booking_id,
        db,
    )

    if booking.status == BookingStatus.CANCELLED:
        raise HTTPException(
            status_code=400,
            detail=("No puedes registrar pagos " "en una reservación cancelada."),
        )

    current_balance = booking.balance

    if current_balance <= 0:
        raise HTTPException(
            status_code=400,
            detail=("La reservación ya se " "encuentra liquidada."),
        )

    if data.amount > current_balance:
        raise HTTPException(
            status_code=400,
            detail=("El pago no puede ser mayor " "al saldo pendiente."),
        )

    if data.amount == current_balance:
        payment_type = PaymentType.SETTLEMENT
    elif booking.total_paid <= 0:
        payment_type = PaymentType.DEPOSIT
    else:
        payment_type = PaymentType.INSTALLMENT

    payment = Payment(
        booking_id=booking.id,
        amount=data.amount,
        payment_type=payment_type,
        payment_method=(data.payment_method),
        reference=(data.reference.strip() if data.reference else None),
        notes=(data.notes.strip() if data.notes else None),
    )

    db.add(payment)

    if data.amount == current_balance:
        booking.status = BookingStatus.PAID

    elif booking.status == BookingStatus.PENDING:
        booking.status = BookingStatus.RESERVED

    db.commit()

    return get_booking_or_404(
        booking.id,
        db,
    )


@router.put(
    "/{booking_id}/status",
    response_model=BookingResponse,
)
def update_booking_status(
    booking_id: uuid.UUID,
    data: BookingStatusUpdate,
    db: Session = Depends(get_db),
):

    booking = get_booking_or_404(
        booking_id,
        db,
    )

    if booking.status == BookingStatus.CANCELLED:
        raise HTTPException(
            status_code=400,
            detail=("Una reservación cancelada " "no puede cambiar de estado."),
        )

    if data.status == BookingStatus.CANCELLED:
        raise HTTPException(
            status_code=400,
            detail=("Utiliza la operación de " "cancelación."),
        )

    if data.status == BookingStatus.PAID and booking.balance > 0:
        raise HTTPException(
            status_code=400,
            detail=(
                "No puedes marcar como "
                "liquidada una reservación "
                "con saldo pendiente."
            ),
        )

    booking.status = data.status

    db.commit()

    return get_booking_or_404(
        booking.id,
        db,
    )


@router.post(
    "/{booking_id}/cancel",
    response_model=BookingResponse,
)
def cancel_booking(
    booking_id: uuid.UUID,
    data: BookingCancel,
    db: Session = Depends(get_db),
):

    booking = get_booking_or_404(
        booking_id,
        db,
    )

    if booking.status == BookingStatus.CANCELLED:
        raise HTTPException(
            status_code=400,
            detail=("La reservación ya se " "encuentra cancelada."),
        )

    booking.status = BookingStatus.CANCELLED

    booking.cancellation_reason = data.reason.strip()

    booking.cancelled_at = datetime.now(BUSINESS_TIMEZONE)

    db.commit()

    return get_booking_or_404(
        booking.id,
        db,
    )
