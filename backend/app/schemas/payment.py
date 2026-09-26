from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)

from app.models.enums import (
    PaymentMethod,
    PaymentType,
)


class PaymentCreate(BaseModel):
    amount: Decimal = Field(
        gt=0,
        max_digits=10,
        decimal_places=2,
    )

    payment_method: PaymentMethod

    reference: str | None = Field(
        default=None,
        max_length=120,
    )

    notes: str | None = Field(
        default=None,
        max_length=500,
    )


class PaymentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID

    amount: Decimal

    payment_type: PaymentType

    payment_method: PaymentMethod

    paid_at: datetime

    reference: str | None

    notes: str | None


class PaymentBookingResponse(BaseModel):
    id: UUID

    folio: str

    event_type: str


class PaymentClientResponse(BaseModel):
    id: UUID

    full_name: str

    phone: str


class PaymentMovementResponse(BaseModel):
    id: UUID

    amount: Decimal

    payment_type: PaymentType

    payment_method: PaymentMethod

    paid_at: datetime

    reference: str | None

    notes: str | None

    booking: PaymentBookingResponse

    client: PaymentClientResponse
