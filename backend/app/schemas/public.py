from datetime import (
    date,
    datetime,
)

from decimal import Decimal
from typing import Literal
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


class PublicPackageDayPriceResponse(BaseModel):
    day_of_week: int

    price: Decimal


class PublicPackagePromotionResponse(BaseModel):
    name: str

    promotional_price: Decimal

    starts_on: date

    ends_on: date

    is_active: bool


class PublicPackageResponse(BaseModel):
    id: UUID

    code: str

    name: str

    description: str | None

    base_price: Decimal

    duration_hours: int

    services: list[str]

    day_prices: list[PublicPackageDayPriceResponse]

    promotions: list[PublicPackagePromotionResponse]


class PublicPackagePriceResponse(BaseModel):
    package_id: UUID

    target_date: date

    day_of_week: int

    base_price: Decimal

    day_price: Decimal | None = None

    promotional_price: Decimal | None = None

    effective_price: Decimal

    source: Literal[
        "base",
        "day",
        "promotion",
    ]

    promotion_name: str | None = None


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
