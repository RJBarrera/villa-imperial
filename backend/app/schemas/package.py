from datetime import date, datetime
from decimal import Decimal
from typing import Literal
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
    model_validator,
)

from app.schemas.service import ServiceResponse


class PackageDayPriceInput(BaseModel):
    day_of_week: int = Field(
        ge=0,
        le=6,
    )

    price: Decimal = Field(
        ge=0,
        max_digits=10,
        decimal_places=2,
    )


class PackageDayPriceResponse(PackageDayPriceInput):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime


class PackagePromotionInput(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=120,
    )

    promotional_price: Decimal = Field(
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    starts_on: date
    ends_on: date
    is_active: bool = True

    @model_validator(mode="after")
    def validate_dates(self):
        if self.ends_on < self.starts_on:
            raise ValueError(
                "La fecha final de la promoción "
                "no puede ser menor a la fecha inicial."
            )

        return self


class PackagePromotionResponse(PackagePromotionInput):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime


def validate_day_prices(
    day_prices: list[PackageDayPriceInput],
) -> list[PackageDayPriceInput]:
    days = [day_price.day_of_week for day_price in day_prices]

    if len(days) != len(set(days)):
        raise ValueError(
            "No puede existir más de un precio " "para el mismo día de la semana."
        )

    return day_prices


def validate_promotions(
    promotions: list[PackagePromotionInput],
) -> list[PackagePromotionInput]:
    active_promotions = sorted(
        [promotion for promotion in promotions if promotion.is_active],
        key=lambda promotion: promotion.starts_on,
    )

    for index in range(1, len(active_promotions)):
        previous = active_promotions[index - 1]
        current = active_promotions[index]

        if current.starts_on <= previous.ends_on:
            raise ValueError(
                "No pueden existir promociones activas " "con periodos traslapados."
            )

    return promotions


class PackageBase(BaseModel):
    code: str = Field(
        min_length=2,
        max_length=30,
    )

    name: str = Field(
        min_length=2,
        max_length=120,
    )

    description: str | None = None

    base_price: Decimal = Field(
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    duration_hours: int = Field(
        default=8,
        ge=1,
        le=24,
    )


class PackageCreate(PackageBase):
    service_ids: list[UUID] = Field(
        default_factory=list,
    )

    day_prices: list[PackageDayPriceInput] = Field(
        default_factory=list,
    )

    promotions: list[PackagePromotionInput] = Field(
        default_factory=list,
    )

    @field_validator("day_prices")
    @classmethod
    def validate_package_day_prices(
        cls,
        value: list[PackageDayPriceInput],
    ):
        return validate_day_prices(value)

    @field_validator("promotions")
    @classmethod
    def validate_package_promotions(
        cls,
        value: list[PackagePromotionInput],
    ):
        return validate_promotions(value)


class PackageUpdate(BaseModel):
    code: str | None = Field(
        default=None,
        min_length=2,
        max_length=30,
    )

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=120,
    )

    description: str | None = None

    base_price: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    duration_hours: int | None = Field(
        default=None,
        ge=1,
        le=24,
    )

    is_active: bool | None = None

    service_ids: list[UUID] | None = None

    day_prices: list[PackageDayPriceInput] | None = None

    promotions: list[PackagePromotionInput] | None = None

    @field_validator("day_prices")
    @classmethod
    def validate_package_day_prices(
        cls,
        value: list[PackageDayPriceInput] | None,
    ):
        if value is None:
            return value

        return validate_day_prices(value)

    @field_validator("promotions")
    @classmethod
    def validate_package_promotions(
        cls,
        value: list[PackagePromotionInput] | None,
    ):
        if value is None:
            return value

        return validate_promotions(value)


class PackageResponse(PackageBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    is_active: bool
    services: list[ServiceResponse]
    day_prices: list[PackageDayPriceResponse]
    promotions: list[PackagePromotionResponse]
    created_at: datetime
    updated_at: datetime


class PackagePriceResponse(BaseModel):
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
