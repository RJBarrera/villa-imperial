from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.service import ServiceResponse


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
    service_ids: list[UUID] = Field(default_factory=list)


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


class PackageResponse(PackageBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID

    is_active: bool

    services: list[ServiceResponse]

    created_at: datetime

    updated_at: datetime
