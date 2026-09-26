from datetime import (
    date,
    datetime,
    time,
)

from decimal import Decimal
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    model_validator,
)

from app.models.enums import (
    BookingStatus,
    PaymentMethod,
)

from app.schemas.payment import (
    PaymentResponse,
)


class BookingClientResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID

    full_name: str

    phone: str

    email: str | None


class BookingPackageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID

    code: str

    name: str

    base_price: Decimal

    duration_hours: int


class BookingCreate(BaseModel):
    client_id: UUID

    package_id: UUID

    event_date: date

    start_time: time

    event_type: str = Field(
        min_length=2,
        max_length=100,
    )

    guest_count: int | None = Field(
        default=None,
        ge=1,
        le=1000,
    )

    discount: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
    )

    initial_payment_amount: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
    )

    initial_payment_method: PaymentMethod | None = None

    payment_reference: str | None = Field(
        default=None,
        max_length=120,
    )

    notes: str | None = None

    @model_validator(mode="after")
    def validate_payment(self):
        if (
            self.initial_payment_amount > Decimal("0.00")
            and self.initial_payment_method is None
        ):
            raise ValueError(
                "Debes indicar la forma de pago " "cuando existe un anticipo."
            )

        return self


class BookingUpdate(BaseModel):
    client_id: UUID | None = None

    package_id: UUID | None = None

    event_date: date | None = None

    start_time: time | None = None

    event_type: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    guest_count: int | None = Field(
        default=None,
        ge=1,
        le=1000,
    )

    discount: Decimal | None = Field(
        default=None,
        ge=0,
    )

    notes: str | None = None


class BookingStatusUpdate(BaseModel):
    status: BookingStatus


class BookingCancel(BaseModel):
    reason: str = Field(
        min_length=3,
        max_length=500,
    )


class BookingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID

    folio: str

    starts_at: datetime

    ends_at: datetime

    event_type: str

    guest_count: int | None

    package_name_snapshot: str

    agreed_price: Decimal

    discount: Decimal

    final_price: Decimal

    total_paid: Decimal

    balance: Decimal

    status: BookingStatus

    notes: str | None

    cancellation_reason: str | None

    cancelled_at: datetime | None

    client: BookingClientResponse

    rental_package: BookingPackageResponse

    payments: list[PaymentResponse]

    created_at: datetime

    updated_at: datetime


class AvailabilityResponse(BaseModel):
    available: bool

    starts_at: datetime

    ends_at: datetime

    conflicting_booking: BookingResponse | None = None
