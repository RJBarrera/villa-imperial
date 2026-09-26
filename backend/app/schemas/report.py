from decimal import Decimal

from pydantic import BaseModel


class MonthlyReportItem(BaseModel):
    month: int
    label: str

    income: Decimal
    expenses: Decimal
    profit: Decimal

    bookings: int


class CategoryReportItem(BaseModel):
    name: str

    total: Decimal

    count: int


class PackageReportItem(BaseModel):
    name: str

    bookings: int

    booked_value: Decimal


class EventTypeReportItem(BaseModel):
    name: str

    bookings: int


class StatusReportItem(BaseModel):
    status: str

    count: int


class ReportSummaryResponse(BaseModel):
    year: int

    income_total: Decimal

    expenses_total: Decimal

    profit_total: Decimal

    bookings_total: int

    booked_value_total: Decimal

    average_booking_value: Decimal

    pending_balance: Decimal

    monthly: list[MonthlyReportItem]

    expense_categories: list[CategoryReportItem]

    packages: list[PackageReportItem]

    event_types: list[EventTypeReportItem]

    statuses: list[StatusReportItem]
