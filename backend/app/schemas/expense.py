from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class ExpenseCreate(BaseModel):
    concept: str = Field(
        min_length=2,
        max_length=150,
    )

    category: str | None = Field(
        default=None,
        max_length=80,
    )

    amount: Decimal = Field(
        gt=0,
        max_digits=10,
        decimal_places=2,
    )

    spent_on: date

    payment_method: str | None = Field(
        default=None,
        max_length=50,
    )

    notes: str | None = None


class ExpenseUpdate(BaseModel):
    concept: str | None = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    category: str | None = Field(
        default=None,
        max_length=80,
    )

    amount: Decimal | None = Field(
        default=None,
        gt=0,
        max_digits=10,
        decimal_places=2,
    )

    spent_on: date | None = None

    payment_method: str | None = Field(
        default=None,
        max_length=50,
    )

    notes: str | None = None


class ExpenseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID

    concept: str

    category: str | None

    amount: Decimal

    spent_at: datetime

    payment_method: str | None

    notes: str | None

    created_at: datetime

    updated_at: datetime
