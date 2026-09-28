import uuid
from decimal import Decimal

from sqlalchemy import CheckConstraint, ForeignKey, Numeric, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Uuid

from app.db.base import Base
from app.models.mixins import TimestampMixin


class PackageDayPrice(Base, TimestampMixin):
    __tablename__ = "package_day_prices"

    __table_args__ = (
        UniqueConstraint(
            "package_id",
            "day_of_week",
            name="uq_package_day_prices_package_day",
        ),
        CheckConstraint(
            "day_of_week >= 0 AND day_of_week <= 6",
            name="ck_package_day_prices_day_of_week",
        ),
        CheckConstraint(
            "price >= 0",
            name="ck_package_day_prices_price",
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

    day_of_week: Mapped[int] = mapped_column(
        nullable=False,
    )

    price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    rental_package = relationship(
        "RentalPackage",
        back_populates="day_prices",
    )
