from decimal import Decimal

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class BusinessSettingsUpdate(BaseModel):
    business_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    phone: str | None = Field(
        default=None,
        max_length=30,
    )

    whatsapp: str | None = Field(
        default=None,
        max_length=30,
    )

    email: str | None = Field(
        default=None,
        max_length=150,
    )

    address: str | None = Field(
        default=None,
        max_length=250,
    )

    city: str | None = Field(
        default=None,
        max_length=100,
    )

    state: str | None = Field(
        default=None,
        max_length=100,
    )

    timezone: str | None = Field(
        default=None,
        max_length=80,
    )

    minimum_deposit: Decimal | None = Field(
        default=None,
        ge=0,
    )

    logo_url: str | None = Field(
        default=None,
        max_length=500,
    )

    receipt_footer: str | None = None


class BusinessSettingsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int

    business_name: str

    phone: str | None

    whatsapp: str | None

    email: str | None

    address: str | None

    city: str | None

    state: str | None

    timezone: str

    minimum_deposit: Decimal

    logo_url: str | None

    receipt_footer: str | None
