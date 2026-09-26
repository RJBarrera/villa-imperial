from datetime import (
    date,
    datetime,
    time,
    timedelta,
)

from fastapi import (
    APIRouter,
    Depends,
    Query,
)

from sqlalchemy import select

from sqlalchemy.orm import (
    Session,
    joinedload,
)

from app.core.config import settings
from app.db.session import get_db

from app.models.booking import Booking
from app.models.payment import Payment

from app.schemas.payment import (
    PaymentMovementResponse,
)

from zoneinfo import ZoneInfo

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


BUSINESS_TIMEZONE = ZoneInfo(settings.business_timezone)


@router.get(
    "",
    response_model=list[PaymentMovementResponse],
)
def get_payments(
    date_from: date | None = Query(default=None),
    date_to: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    statement = (
        select(Payment)
        .join(
            Booking,
            Payment.booking_id == Booking.id,
        )
        .options(joinedload(Payment.booking).joinedload(Booking.client))
        .order_by(Payment.paid_at.desc())
    )

    if date_from:
        start = datetime.combine(
            date_from,
            time.min,
            tzinfo=BUSINESS_TIMEZONE,
        )

        statement = statement.where(Payment.paid_at >= start)

    if date_to:
        end = datetime.combine(
            date_to + timedelta(days=1),
            time.min,
            tzinfo=BUSINESS_TIMEZONE,
        )

        statement = statement.where(Payment.paid_at < end)

    payments = db.scalars(statement).unique().all()

    return [
        {
            "id": payment.id,
            "amount": payment.amount,
            "payment_type": payment.payment_type,
            "payment_method": payment.payment_method,
            "paid_at": payment.paid_at,
            "reference": payment.reference,
            "notes": payment.notes,
            "booking": {
                "id": payment.booking.id,
                "folio": payment.booking.folio,
                "event_type": payment.booking.event_type,
            },
            "client": {
                "id": payment.booking.client.id,
                "full_name": payment.booking.client.full_name,
                "phone": payment.booking.client.phone,
            },
        }
        for payment in payments
    ]
