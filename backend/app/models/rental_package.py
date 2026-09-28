import uuid
from decimal import Decimal

from sqlalchemy import Boolean, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Uuid

from app.db.base import Base
from app.models.mixins import TimestampMixin
from app.models.package_day_price import PackageDayPrice
from app.models.package_promotion import PackagePromotion
from app.models.package_service import package_services


class RentalPackage(Base, TimestampMixin):
    __tablename__ = "packages"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    code: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    base_price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    duration_hours: Mapped[int] = mapped_column(
        Integer,
        default=8,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    services = relationship(
        "Service",
        secondary=package_services,
        lazy="selectin",
    )

    bookings = relationship(
        "Booking",
        back_populates="rental_package",
    )

    day_prices: Mapped[list["PackageDayPrice"]] = relationship(
        "PackageDayPrice",
        back_populates="rental_package",
        cascade="all, delete-orphan",
        lazy="selectin",
        order_by="PackageDayPrice.day_of_week",
    )

    promotions: Mapped[list["PackagePromotion"]] = relationship(
        "PackagePromotion",
        back_populates="rental_package",
        cascade="all, delete-orphan",
        lazy="selectin",
        order_by="PackagePromotion.starts_on.desc()",
    )
