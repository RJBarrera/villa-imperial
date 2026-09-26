from datetime import (
    datetime,
    time,
)

from decimal import Decimal
from zoneinfo import ZoneInfo

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)

from sqlalchemy import (
    func,
    select,
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

from app.models.expense import Expense
from app.models.payment import Payment

from app.schemas.dashboard import (
    DashboardSummaryResponse,
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


BUSINESS_TIMEZONE = ZoneInfo(settings.business_timezone)


def get_month_range(
    month: str | None,
):
    now = datetime.now(BUSINESS_TIMEZONE)

    if month:
        try:
            selected = datetime.strptime(
                month,
                "%Y-%m",
            )

        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=("El mes debe tener " "formato YYYY-MM."),
            )

        year = selected.year
        month_number = selected.month

    else:
        year = now.year
        month_number = now.month

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

    return start, end


@router.get(
    "/summary",
    response_model=DashboardSummaryResponse,
)
def get_dashboard_summary(
    month: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    start, end = get_month_range(month)

    now = datetime.now(BUSINESS_TIMEZONE)

    # =========================
    # RESERVACIONES DEL MES
    # =========================

    monthly_bookings = list(
        db.scalars(
            select(Booking).where(
                Booking.starts_at >= start,
                Booking.starts_at < end,
                Booking.status != BookingStatus.CANCELLED,
            )
        ).all()
    )

    bookings_count = len(monthly_bookings)

    # =========================
    # OCUPACIÓN
    # =========================

    occupied_dates = {
        booking.starts_at.astimezone(BUSINESS_TIMEZONE).date()
        for booking in monthly_bookings
    }

    occupied_days = len(occupied_dates)

    days_in_month = (end.date() - start.date()).days

    occupancy_rate = (
        round(
            occupied_days / days_in_month * 100,
            1,
        )
        if days_in_month
        else 0
    )

    # =========================
    # PAGOS DEL MES
    # =========================

    payments = list(
        db.scalars(
            select(Payment).where(
                Payment.paid_at >= start,
                Payment.paid_at < end,
            )
        ).all()
    )

    income_received = Decimal("0.00")

    for payment in payments:
        if payment.payment_type == PaymentType.REFUND:
            income_received -= payment.amount

        else:
            income_received += payment.amount

    # =========================
    # GASTOS DEL MES
    # =========================

    expenses = list(
        db.scalars(
            select(Expense).where(
                Expense.spent_at >= start,
                Expense.spent_at < end,
            )
        ).all()
    )

    expenses_total = sum(
        (expense.amount for expense in expenses),
        Decimal("0.00"),
    )

    profit = income_received - expenses_total

    # =========================
    # SALDO POR COBRAR
    # =========================

    active_bookings = list(
        db.scalars(
            select(Booking)
            .options(selectinload(Booking.payments))
            .where(Booking.status != BookingStatus.CANCELLED)
        )
        .unique()
        .all()
    )

    pending_balance = sum(
        (booking.balance for booking in active_bookings),
        Decimal("0.00"),
    )

    # =========================
    # CLIENTES ACTIVOS
    # =========================

    active_clients = len(
        db.scalars(
            select(Client.id).where(Client.is_active.is_(True))
        ).all()
    )

    # =========================
    # PRÓXIMOS EVENTOS
    # =========================

    upcoming = list(
        db.scalars(
            select(Booking)
            .options(
                selectinload(Booking.client),
                selectinload(Booking.payments),
            )
            .where(
                Booking.starts_at >= now,
                Booking.status != BookingStatus.CANCELLED,
            )
            .order_by(Booking.starts_at.asc())
            .limit(5)
        )
        .unique()
        .all()
    )

    return {
        "month": start.strftime("%Y-%m"),
        "bookings_count": bookings_count,
        "income_received": income_received,
        "expenses_total": expenses_total,
        "profit": profit,
        "pending_balance": pending_balance,
        "active_clients": int(active_clients),
        "occupied_days": occupied_days,
        "days_in_month": days_in_month,
        "occupancy_rate": occupancy_rate,
        "upcoming_bookings": [
            {
                "id": booking.id,
                "folio": booking.folio,
                "event_type": booking.event_type,
                "client_name": booking.client.full_name,
                "package_name": booking.package_name_snapshot,
                "starts_at": booking.starts_at,
                "ends_at": booking.ends_at,
                "status": booking.status,
                "balance": booking.balance,
            }
            for booking in upcoming
        ],
    }
