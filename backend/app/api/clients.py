from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.client import Client
from app.schemas.client import (
    ClientCreate,
    ClientResponse,
    ClientUpdate,
)

router = APIRouter(
    prefix="/clients",
    tags=["Clients"],
)


@router.get(
    "",
    response_model=list[ClientResponse],
)
def get_clients(
    search: str | None = Query(
        default=None,
        max_length=100,
    ),
    active_only: bool = True,
    db: Session = Depends(get_db),
):
    statement = select(Client)

    if active_only:
        statement = statement.where(Client.is_active.is_(True))

    if search:
        search_value = f"%{search.strip()}%"

        statement = statement.where(
            or_(
                Client.full_name.ilike(search_value),
                Client.phone.ilike(search_value),
                Client.email.ilike(search_value),
            )
        )

    statement = statement.order_by(Client.full_name.asc())

    return db.scalars(statement).all()


@router.get(
    "/{client_id}",
    response_model=ClientResponse,
)
def get_client(
    client_id: UUID,
    db: Session = Depends(get_db),
):
    client = db.get(
        Client,
        client_id,
    )

    if client is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado.",
        )

    return client


@router.post(
    "",
    response_model=ClientResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_client(
    data: ClientCreate,
    db: Session = Depends(get_db),
):
    client = Client(**data.model_dump())

    db.add(client)

    db.commit()

    db.refresh(client)

    return client


@router.put(
    "/{client_id}",
    response_model=ClientResponse,
)
def update_client(
    client_id: UUID,
    data: ClientUpdate,
    db: Session = Depends(get_db),
):
    client = db.get(
        Client,
        client_id,
    )

    if client is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado.",
        )

    values = data.model_dump(exclude_unset=True)

    for field, value in values.items():
        setattr(
            client,
            field,
            value,
        )

    db.commit()

    db.refresh(client)

    return client
