import uuid

from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from sqlalchemy.types import Uuid

from app.db.base import Base

from app.models.enums import (
    BookingStatus,
    PaymentType,
)

from app.models.mixins import TimestampMixin


def enum_values(enum_class):
    return [item.value for item in enum_class]


class Booking(
    Base,
    TimestampMixin,
):
    __tablename__ = "bookings"

    __table_args__ = (
        CheckConstraint(
            "ends_at > starts_at",
            name="ck_booking_valid_time",
        ),
        CheckConstraint(
            "agreed_price >= 0",
            name="ck_booking_price_positive",
        ),
        CheckConstraint(
            "discount >= 0",
            name="ck_booking_discount_positive",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    folio: Mapped[str] = mapped_column(
        String(40),
        unique=True,
        nullable=False,
        index=True,
    )

    client_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey(
            "clients.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    package_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey(
            "packages.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    starts_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )

    ends_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )

    event_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    guest_count: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    package_name_snapshot: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    agreed_price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    discount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        default=Decimal("0.00"),
        nullable=False,
    )

    status: Mapped[BookingStatus] = mapped_column(
        SAEnum(
            BookingStatus,
            name="booking_status",
            native_enum=False,
            values_callable=enum_values,
        ),
        default=BookingStatus.PENDING,
        nullable=False,
        index=True,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    cancellation_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    cancelled_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    client = relationship(
        "Client",
        back_populates="bookings",
    )

    rental_package = relationship(
        "RentalPackage",
        back_populates="bookings",
    )

    payments = relationship(
        "Payment",
        back_populates="booking",
        cascade="all, delete-orphan",
        order_by="Payment.paid_at",
    )

    @property
    def final_price(self) -> Decimal:
        return self.agreed_price - self.discount

    @property
    def total_paid(self) -> Decimal:
        total = Decimal("0.00")

        for payment in self.payments:
            if payment.payment_type == PaymentType.REFUND:
                total -= payment.amount
            else:
                total += payment.amount

        return total

    @property
    def balance(self) -> Decimal:
        pending = self.final_price - self.total_paid

        return max(
            pending,
            Decimal("0.00"),
        )
