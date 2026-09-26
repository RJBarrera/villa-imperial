from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy.types import Uuid

from app.db.base import Base

package_services = Table(
    "package_services",
    Base.metadata,
    Column(
        "package_id",
        Uuid(as_uuid=True),
        ForeignKey(
            "packages.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    ),
    Column(
        "service_id",
        Uuid(as_uuid=True),
        ForeignKey(
            "services.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    ),
)
