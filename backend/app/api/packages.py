from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models.rental_package import RentalPackage
from app.models.service import Service
from app.schemas.package import (
    PackageCreate,
    PackageResponse,
    PackageUpdate,
)

router = APIRouter(
    prefix="/packages",
    tags=["Packages"],
)


def get_package_or_404(
    package_id: UUID,
    db: Session,
) -> RentalPackage:
    statement = (
        select(RentalPackage)
        .options(selectinload(RentalPackage.services))
        .where(RentalPackage.id == package_id)
    )

    rental_package = db.scalar(statement)

    if rental_package is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paquete no encontrado.",
        )

    return rental_package


def get_services_by_ids(
    service_ids: list[UUID],
    db: Session,
) -> list[Service]:
    if not service_ids:
        return []

    statement = select(Service).where(
        Service.id.in_(service_ids),
        Service.is_active.is_(True),
    )

    services = list(db.scalars(statement).all())

    if len(services) != len(set(service_ids)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=("Uno o más servicios " "no existen o están inactivos."),
        )

    return services


@router.get(
    "",
    response_model=list[PackageResponse],
)
def get_packages(
    active_only: bool = True,
    db: Session = Depends(get_db),
):
    statement = select(RentalPackage).options(selectinload(RentalPackage.services))

    if active_only:
        statement = statement.where(RentalPackage.is_active.is_(True))

    statement = statement.order_by(RentalPackage.base_price.asc())

    return db.scalars(statement).unique().all()


@router.get(
    "/{package_id}",
    response_model=PackageResponse,
)
def get_package(
    package_id: UUID,
    db: Session = Depends(get_db),
):
    return get_package_or_404(
        package_id,
        db,
    )


@router.post(
    "",
    response_model=PackageResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_package(
    data: PackageCreate,
    db: Session = Depends(get_db),
):
    existing = db.scalar(select(RentalPackage).where(RentalPackage.code == data.code))

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=("Ya existe un paquete " "con ese código."),
        )

    services = get_services_by_ids(
        data.service_ids,
        db,
    )

    package_data = data.model_dump(exclude={"service_ids"})

    rental_package = RentalPackage(**package_data)

    rental_package.services = services

    db.add(rental_package)

    db.commit()

    return get_package_or_404(
        rental_package.id,
        db,
    )


@router.put(
    "/{package_id}",
    response_model=PackageResponse,
)
def update_package(
    package_id: UUID,
    data: PackageUpdate,
    db: Session = Depends(get_db),
):
    rental_package = get_package_or_404(
        package_id,
        db,
    )

    values = data.model_dump(exclude_unset=True)

    service_ids = values.pop(
        "service_ids",
        None,
    )

    new_code = values.get("code")

    if new_code:
        existing = db.scalar(
            select(RentalPackage).where(
                RentalPackage.code == new_code,
                RentalPackage.id != package_id,
            )
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=("Ya existe otro paquete " "con ese código."),
            )

    for field, value in values.items():
        setattr(
            rental_package,
            field,
            value,
        )

    if service_ids is not None:
        rental_package.services = get_services_by_ids(
            service_ids,
            db,
        )

    db.commit()

    return get_package_or_404(
        rental_package.id,
        db,
    )
