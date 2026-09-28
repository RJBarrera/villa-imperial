from datetime import date
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response,
    status,
)
from sqlalchemy import select
from sqlalchemy.orm import (
    Session,
    selectinload,
)

from app.db.session import get_db
from app.models.package_day_price import (
    PackageDayPrice,
)
from app.models.package_promotion import (
    PackagePromotion,
)
from app.models.rental_package import (
    RentalPackage,
)
from app.models.service import Service
from app.schemas.package import (
    PackageCreate,
    PackagePriceResponse,
    PackageResponse,
    PackageUpdate,
)
from app.services.package_pricing import (
    calculate_package_price,
)

router = APIRouter(
    prefix="/packages",
    tags=["Packages"],
)


def package_load_options():
    return (
        selectinload(RentalPackage.services),
        selectinload(RentalPackage.day_prices),
        selectinload(RentalPackage.promotions),
    )


def get_package_or_404(
    package_id: UUID,
    db: Session,
) -> RentalPackage:
    statement = (
        select(RentalPackage)
        .options(*package_load_options())
        .where(
            RentalPackage.id == package_id,
        )
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


def build_day_prices(
    day_prices,
) -> list[PackageDayPrice]:
    return [
        PackageDayPrice(
            day_of_week=day_price.day_of_week,
            price=day_price.price,
        )
        for day_price in day_prices
    ]


def sync_day_prices(
    rental_package: RentalPackage,
    day_prices,
):
    incoming_by_day = {item.day_of_week: item for item in day_prices}
    existing_by_day = {item.day_of_week: item for item in rental_package.day_prices}

    # Actualizar existentes o crear nuevos
    for day_of_week, incoming in incoming_by_day.items():
        existing = existing_by_day.get(day_of_week)

        if existing is not None:
            existing.price = incoming.price
        else:
            rental_package.day_prices.append(
                PackageDayPrice(
                    day_of_week=day_of_week,
                    price=incoming.price,
                )
            )

    # Eliminar días que ya no vienen configurados
    for existing in list(rental_package.day_prices):
        if existing.day_of_week not in incoming_by_day:
            rental_package.day_prices.remove(existing)


def build_promotions(
    promotions,
) -> list[PackagePromotion]:
    return [
        PackagePromotion(
            name=promotion.name,
            promotional_price=(promotion.promotional_price),
            starts_on=promotion.starts_on,
            ends_on=promotion.ends_on,
            is_active=promotion.is_active,
        )
        for promotion in promotions
    ]


@router.get(
    "",
    response_model=list[PackageResponse],
)
def get_packages(
    active_only: bool = True,
    db: Session = Depends(get_db),
):
    statement = select(RentalPackage).options(*package_load_options())

    if active_only:
        statement = statement.where(RentalPackage.is_active.is_(True))

    statement = statement.order_by(RentalPackage.base_price.asc())

    return db.scalars(statement).unique().all()


@router.get(
    "/{package_id}/price",
    response_model=PackagePriceResponse,
)
def get_package_price(
    package_id: UUID,
    target_date: date,
    db: Session = Depends(get_db),
):
    rental_package = get_package_or_404(
        package_id,
        db,
    )

    return calculate_package_price(
        rental_package,
        target_date,
    )


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

    package_data = data.model_dump(
        exclude={
            "service_ids",
            "day_prices",
            "promotions",
        }
    )

    rental_package = RentalPackage(**package_data)

    rental_package.services = services

    rental_package.day_prices = build_day_prices(data.day_prices)

    rental_package.promotions = build_promotions(data.promotions)

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

    values = data.model_dump(
        exclude_unset=True,
        exclude={
            "service_ids",
            "day_prices",
            "promotions",
        },
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
                status_code=(status.HTTP_409_CONFLICT),
                detail=("Ya existe otro paquete " "con ese código."),
            )

    for field, value in values.items():
        setattr(
            rental_package,
            field,
            value,
        )

    if "service_ids" in data.model_fields_set:
        rental_package.services = get_services_by_ids(
            data.service_ids or [],
            db,
        )

    if "day_prices" in data.model_fields_set:
        sync_day_prices(
            rental_package,
            data.day_prices or [],
        )

    if "promotions" in data.model_fields_set:
        rental_package.promotions = build_promotions(data.promotions or [])

    db.commit()

    return get_package_or_404(
        package_id,
        db,
    )


@router.delete(
    "/{package_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_package(
    package_id: UUID,
    db: Session = Depends(get_db),
):
    rental_package = get_package_or_404(
        package_id,
        db,
    )

    rental_package.is_active = False

    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
