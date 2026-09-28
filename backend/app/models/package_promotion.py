import uuid
from datetime import date
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Date,
    ForeignKey,
    Numeric,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Uuid

from app.db.base import Base
from app.models.mixins import TimestampMixin


class PackagePromotion(Base, TimestampMixin):
    __tablename__ = "package_promotions"

    __table_args__ = (
        CheckConstraint(
            "promotional_price >= 0",
            name="ck_package_promotions_price",
        ),
        CheckConstraint(
            "ends_on >= starts_on",
            name="ck_package_promotions_dates",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    package_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey(
            "packages.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    promotional_price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    starts_on: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    ends_on: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    rental_package = relationship(
        "RentalPackage",
        back_populates="promotions",
    )
