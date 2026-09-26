from datetime import (
    date,
    datetime,
)

from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class PublicBusinessResponse(BaseModel):
    business_name: str

    phone: str | None

    whatsapp: str | None

    email: str | None

    address: str | None

    city: str | None

    state: str | None

    logo_url: str | None

    minimum_deposit: Decimal


class PublicPackageResponse(BaseModel):
    id: UUID

    code: str

    name: str

    description: str | None

    base_price: Decimal

    duration_hours: int

    services: list[str]


class PublicCalendarDayResponse(BaseModel):
    date: date

    bookings_count: int


class PublicCalendarResponse(BaseModel):
    month: str

    days: list[PublicCalendarDayResponse]


class PublicAvailabilityResponse(BaseModel):
    available: bool

    starts_at: datetime

    ends_at: datetime
