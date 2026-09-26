from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.models.business_settings import (
    BusinessSettings,
)

from app.schemas.settings import (
    BusinessSettingsResponse,
    BusinessSettingsUpdate,
)

router = APIRouter(
    prefix="/settings",
    tags=["Settings"],
)


def get_or_create_settings(
    db: Session,
) -> BusinessSettings:
    settings = db.get(
        BusinessSettings,
        1,
    )

    if settings is None:
        settings = BusinessSettings(
            id=1,
            business_name=("Villa Imperial"),
            timezone=("America/Mazatlan"),
        )

        db.add(settings)

        db.commit()

        db.refresh(settings)

    return settings


@router.get(
    "/business",
    response_model=(BusinessSettingsResponse),
)
def get_business_settings(
    db: Session = Depends(get_db),
):
    return get_or_create_settings(db)


@router.put(
    "/business",
    response_model=(BusinessSettingsResponse),
)
def update_business_settings(
    data: BusinessSettingsUpdate,
    db: Session = Depends(get_db),
):
    settings = get_or_create_settings(db)

    values = data.model_dump(exclude_unset=True)

    for field, value in values.items():
        if (
            isinstance(
                value,
                str,
            )
            and field != "receipt_footer"
        ):
            value = value.strip() or None

        setattr(
            settings,
            field,
            value,
        )

    db.commit()

    db.refresh(settings)

    return settings
