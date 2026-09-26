from collections import defaultdict

from datetime import datetime
from decimal import Decimal
from zoneinfo import ZoneInfo

from fastapi import (
    APIRouter,
    Depends,
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

from app.models.enums import (
    BookingStatus,
    PaymentType,
)

from app.models.expense import Expense
from app.models.payment import Payment

from app.schemas.report import (
    ReportSummaryResponse,
)

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


BUSINESS_TIMEZONE = ZoneInfo(settings.business_timezone)


MONTH_LABELS = {
    1: "Ene",
    2: "Feb",
    3: "Mar",
    4: "Abr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Ago",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dic",
}


def get_year_range(
    year: int,
):
    start = datetime(
        year,
        1,
        1,
        tzinfo=BUSINESS_TIMEZONE,
    )

    end = datetime(
        year + 1,
        1,
        1,
        tzinfo=BUSINESS_TIMEZONE,
    )

    return start, end


@router.get(
    "/summary",
    response_model=ReportSummaryResponse,
)
def get_reports_summary(
    year: int = Query(
        default_factory=lambda: datetime.now(BUSINESS_TIMEZONE).year,
        ge=2000,
        le=2100,
    ),
    db: Session = Depends(get_db),
):
    start, end = get_year_range(year)

    # =====================================
    # PAGOS DEL AÑO
    # =====================================

    payments = list(
        db.scalars(
            select(Payment).where(
                Payment.paid_at >= start,
                Payment.paid_at < end,
            )
        ).all()
    )

    # =====================================
    # GASTOS DEL AÑO
    # =====================================

    expenses = list(
        db.scalars(
            select(Expense).where(
                Expense.spent_at >= start,
                Expense.spent_at < end,
            )
        ).all()
    )

    # =====================================
    # RESERVACIONES DEL AÑO
    # =====================================

    bookings = list(
        db.scalars(
            select(Booking)
            .options(selectinload(Booking.payments))
            .where(
                Booking.starts_at >= start,
                Booking.starts_at < end,
            )
        )
        .unique()
        .all()
    )

    active_bookings = [
        booking for booking in bookings if booking.status != BookingStatus.CANCELLED
    ]

    # =====================================
    # BASES MENSUALES
    # =====================================

    monthly_income = {month: Decimal("0.00") for month in range(1, 13)}

    monthly_expenses = {month: Decimal("0.00") for month in range(1, 13)}

    monthly_bookings = {month: 0 for month in range(1, 13)}

    # =====================================
    # INGRESOS
    # =====================================

    income_total = Decimal("0.00")

    for payment in payments:
        local_date = payment.paid_at.astimezone(BUSINESS_TIMEZONE)

        month = local_date.month

        amount = payment.amount

        if payment.payment_type == PaymentType.REFUND:
            monthly_income[month] -= amount

            income_total -= amount

        else:
            monthly_income[month] += amount

            income_total += amount

    # =====================================
    # GASTOS
    # =====================================

    expenses_total = Decimal("0.00")

    expense_categories = defaultdict(
        lambda: {
            "total": Decimal("0.00"),
            "count": 0,
        }
    )

    for expense in expenses:
        local_date = expense.spent_at.astimezone(BUSINESS_TIMEZONE)

        month = local_date.month

        monthly_expenses[month] += expense.amount

        expenses_total += expense.amount

        category = expense.category or "Sin categoría"

        expense_categories[category]["total"] += expense.amount

        expense_categories[category]["count"] += 1

    # =====================================
    # RESERVACIONES
    # =====================================

    package_metrics = defaultdict(
        lambda: {
            "bookings": 0,
            "booked_value": Decimal("0.00"),
        }
    )

    event_metrics = defaultdict(int)

    status_metrics = defaultdict(int)

    booked_value_total = Decimal("0.00")

    for booking in bookings:
        status_metrics[booking.status.value] += 1

    for booking in active_bookings:
        local_start = booking.starts_at.astimezone(BUSINESS_TIMEZONE)

        month = local_start.month

        monthly_bookings[month] += 1

        final_price = booking.final_price

        booked_value_total += final_price

        package_name = booking.package_name_snapshot

        package_metrics[package_name]["bookings"] += 1

        package_metrics[package_name]["booked_value"] += final_price

        event_type = booking.event_type.strip().title()

        event_metrics[event_type] += 1

    # =====================================
    # SALDO PENDIENTE
    # =====================================

    pending_balance = sum(
        (booking.balance for booking in active_bookings),
        Decimal("0.00"),
    )

    # =====================================
    # TICKET PROMEDIO
    # =====================================

    bookings_total = len(active_bookings)

    average_booking_value = (
        booked_value_total / bookings_total if bookings_total else Decimal("0.00")
    )

    # =====================================
    # UTILIDAD
    # =====================================

    profit_total = income_total - expenses_total

    # =====================================
    # SERIE MENSUAL
    # =====================================

    monthly = []

    for month in range(
        1,
        13,
    ):
        income = monthly_income[month]

        expense = monthly_expenses[month]

        monthly.append(
            {
                "month": month,
                "label": MONTH_LABELS[month],
                "income": income,
                "expenses": expense,
                "profit": income - expense,
                "bookings": monthly_bookings[month],
            }
        )

    # =====================================
    # GASTOS POR CATEGORÍA
    # =====================================

    categories_result = [
        {
            "name": name,
            "total": values["total"],
            "count": values["count"],
        }
        for name, values in expense_categories.items()
    ]

    categories_result.sort(
        key=lambda item: item["total"],
        reverse=True,
    )

    # =====================================
    # PAQUETES
    # =====================================

    packages_result = [
        {
            "name": name,
            "bookings": values["bookings"],
            "booked_value": values["booked_value"],
        }
        for name, values in package_metrics.items()
    ]

    packages_result.sort(
        key=lambda item: item["bookings"],
        reverse=True,
    )

    # =====================================
    # TIPOS DE EVENTO
    # =====================================

    event_types_result = [
        {
            "name": name,
            "bookings": count,
        }
        for name, count in event_metrics.items()
    ]

    event_types_result.sort(
        key=lambda item: item["bookings"],
        reverse=True,
    )

    # =====================================
    # ESTADOS
    # =====================================

    statuses_result = [
        {
            "status": status_name,
            "count": count,
        }
        for status_name, count in status_metrics.items()
    ]

    statuses_result.sort(
        key=lambda item: item["count"],
        reverse=True,
    )

    return {
        "year": year,
        "income_total": income_total,
        "expenses_total": expenses_total,
        "profit_total": profit_total,
        "bookings_total": bookings_total,
        "booked_value_total": booked_value_total,
        "average_booking_value": average_booking_value,
        "pending_balance": pending_balance,
        "monthly": monthly,
        "expense_categories": categories_result,
        "packages": packages_result,
        "event_types": event_types_result,
        "statuses": statuses_result,
    }
