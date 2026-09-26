from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel

from app.models.enums import (
    BookingStatus,
)


class DashboardBookingResponse(BaseModel):
    id: UUID

    folio: str

    event_type: str

    client_name: str

    package_name: str

    starts_at: datetime

    ends_at: datetime

    status: BookingStatus

    balance: Decimal


class DashboardSummaryResponse(BaseModel):
    month: str

    bookings_count: int

    income_received: Decimal

    expenses_total: Decimal

    profit: Decimal

    pending_balance: Decimal

    active_clients: int

    occupied_days: int

    days_in_month: int

    occupancy_rate: float

    upcoming_bookings: list[DashboardBookingResponse]
