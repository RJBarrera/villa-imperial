import uuid

from collections import defaultdict

from datetime import (
    date,
    datetime,
    time,
    timedelta,
)

from zoneinfo import ZoneInfo

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)

from sqlalchemy import select

from sqlalchemy.orm import (
    Session,
    selectinload,
)

from app.core.config import settings

from app.db.session import get_db

from app.models.booking import Booking

from app.models.business_settings import (
    BusinessSettings,
)

from app.models.enums import (
    BookingStatus,
)

from app.models.rental_package import (
    RentalPackage,
)

from app.schemas.public import (
    PublicAvailabilityResponse,
    PublicBusinessResponse,
    PublicCalendarResponse,
    PublicPackageResponse,
)

router = APIRouter(
    prefix="/public",
    tags=["Public"],
)


BUSINESS_TIMEZONE = ZoneInfo(settings.business_timezone)


# =========================================
# INFORMACIÓN PÚBLICA DEL NEGOCIO
# =========================================


@router.get(
    "/business",
    response_model=PublicBusinessResponse,
)
def get_public_business(
    db: Session = Depends(get_db),
):
    business = db.get(
        BusinessSettings,
        1,
    )

    if business is None:
        return {
            "business_name": "Villa Imperial",
            "phone": None,
            "whatsapp": None,
            "email": None,
            "address": None,
            "city": None,
            "state": None,
            "logo_url": None,
            "minimum_deposit": 0,
        }

    return {
        "business_name": business.business_name,
        "phone": business.phone,
        "whatsapp": business.whatsapp,
        "email": business.email,
        "address": business.address,
        "city": business.city,
        "state": business.state,
        "logo_url": business.logo_url,
        "minimum_deposit": business.minimum_deposit,
    }


# =========================================
# PAQUETES PÚBLICOS
# =========================================


@router.get(
    "/packages",
    response_model=list[PublicPackageResponse],
)
def get_public_packages(
    db: Session = Depends(get_db),
):
    packages = (
        db.scalars(
            select(RentalPackage)
            .options(selectinload(RentalPackage.services))
            .where(RentalPackage.is_active.is_(True))
            .order_by(RentalPackage.base_price.asc())
        )
        .unique()
        .all()
    )

    return [
        {
            "id": rental_package.id,
            "code": rental_package.code,
            "name": rental_package.name,
            "description": rental_package.description,
            "base_price": rental_package.base_price,
            "duration_hours": rental_package.duration_hours,
            "services": [
                service.name for service in rental_package.services if service.is_active
            ],
        }
        for rental_package in packages
    ]


# =========================================
# CALENDARIO PÚBLICO
# =========================================


@router.get(
    "/calendar",
    response_model=PublicCalendarResponse,
)
def get_public_calendar(
    month: str = Query(description="Formato YYYY-MM"),
    db: Session = Depends(get_db),
):
    try:
        selected_month = datetime.strptime(
            month,
            "%Y-%m",
        )

    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=("El mes debe tener " "formato YYYY-MM."),
        )

    year = selected_month.year

    month_number = selected_month.month

    start = datetime(
        year,
        month_number,
        1,
        tzinfo=BUSINESS_TIMEZONE,
    )

    if month_number == 12:
        end = datetime(
            year + 1,
            1,
            1,
            tzinfo=BUSINESS_TIMEZONE,
        )

    else:
        end = datetime(
            year,
            month_number + 1,
            1,
            tzinfo=BUSINESS_TIMEZONE,
        )

    bookings = db.scalars(
        select(Booking)
        .where(
            Booking.status != BookingStatus.CANCELLED,
            Booking.starts_at < end,
            Booking.ends_at > start,
        )
        .order_by(Booking.starts_at.asc())
    ).all()

    day_counts: dict[
        date,
        int,
    ] = defaultdict(int)

    for booking in bookings:
        local_start = booking.starts_at.astimezone(BUSINESS_TIMEZONE)

        local_end = booking.ends_at.astimezone(BUSINESS_TIMEZONE)

        current_date = local_start.date()

        last_date = (local_end - timedelta(microseconds=1)).date()

        while current_date <= last_date:
            if current_date >= start.date() and current_date < end.date():
                day_counts[current_date] += 1

            current_date += timedelta(days=1)

    days = [
        {
            "date": day,
            "bookings_count": count,
        }
        for day, count in sorted(day_counts.items())
    ]

    return {
        "month": month,
        "days": days,
    }


# =========================================
# DISPONIBILIDAD EXACTA
# =========================================


@router.get(
    "/availability",
    response_model=PublicAvailabilityResponse,
)
def check_public_availability(
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
            detail=("Paquete no encontrado."),
        )

    starts_at = datetime.combine(
        event_date,
        start_time,
        tzinfo=BUSINESS_TIMEZONE,
    )

    ends_at = starts_at + timedelta(hours=(rental_package.duration_hours))

    conflict = db.scalar(
        select(Booking.id)
        .where(
            Booking.status != BookingStatus.CANCELLED,
            Booking.starts_at < ends_at,
            Booking.ends_at > starts_at,
        )
        .limit(1)
    )

    return {
        "available": conflict is None,
        "starts_at": starts_at,
        "ends_at": ends_at,
    }
