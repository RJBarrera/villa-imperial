from datetime import (
    date,
    datetime,
    time,
    timedelta,
)

from uuid import UUID
from zoneinfo import ZoneInfo

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)

from sqlalchemy import (
    or_,
    select,
)

from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.expense import Expense

from app.schemas.expense import (
    ExpenseCreate,
    ExpenseResponse,
    ExpenseUpdate,
)

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"],
)


BUSINESS_TIMEZONE = ZoneInfo(settings.business_timezone)


@router.get(
    "",
    response_model=list[ExpenseResponse],
)
def get_expenses(
    date_from: date | None = Query(default=None),
    date_to: date | None = Query(default=None),
    search: str | None = Query(
        default=None,
        max_length=100,
    ),
    db: Session = Depends(get_db),
):
    statement = select(Expense)

    if date_from:
        start = datetime.combine(
            date_from,
            time.min,
            tzinfo=BUSINESS_TIMEZONE,
        )

        statement = statement.where(Expense.spent_at >= start)

    if date_to:
        end = datetime.combine(
            date_to + timedelta(days=1),
            time.min,
            tzinfo=BUSINESS_TIMEZONE,
        )

        statement = statement.where(Expense.spent_at < end)

    if search:
        search_value = f"%{search.strip()}%"

        statement = statement.where(
            or_(
                Expense.concept.ilike(search_value),
                Expense.category.ilike(search_value),
                Expense.notes.ilike(search_value),
            )
        )

    statement = statement.order_by(Expense.spent_at.desc())

    return db.scalars(statement).all()


@router.get(
    "/{expense_id}",
    response_model=ExpenseResponse,
)
def get_expense(
    expense_id: UUID,
    db: Session = Depends(get_db),
):
    expense = db.get(
        Expense,
        expense_id,
    )

    if expense is None:
        raise HTTPException(
            status_code=404,
            detail="Gasto no encontrado.",
        )

    return expense


@router.post(
    "",
    response_model=ExpenseResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_expense(
    data: ExpenseCreate,
    db: Session = Depends(get_db),
):
    spent_at = datetime.combine(
        data.spent_on,
        time(hour=12),
        tzinfo=BUSINESS_TIMEZONE,
    )

    expense = Expense(
        concept=data.concept.strip(),
        category=(
            data.category.strip() if data.category and data.category.strip() else None
        ),
        amount=data.amount,
        spent_at=spent_at,
        payment_method=(
            data.payment_method.strip()
            if data.payment_method and data.payment_method.strip()
            else None
        ),
        notes=(data.notes.strip() if data.notes and data.notes.strip() else None),
    )

    db.add(expense)

    db.commit()

    db.refresh(expense)

    return expense


@router.put(
    "/{expense_id}",
    response_model=ExpenseResponse,
)
def update_expense(
    expense_id: UUID,
    data: ExpenseUpdate,
    db: Session = Depends(get_db),
):
    expense = db.get(
        Expense,
        expense_id,
    )

    if expense is None:
        raise HTTPException(
            status_code=404,
            detail="Gasto no encontrado.",
        )

    values = data.model_dump(exclude_unset=True)

    spent_on = values.pop(
        "spent_on",
        None,
    )

    if spent_on is not None:
        expense.spent_at = datetime.combine(
            spent_on,
            time(hour=12),
            tzinfo=BUSINESS_TIMEZONE,
        )

    if "concept" in values:
        expense.concept = values["concept"].strip()

    if "category" in values:
        value = values["category"]

        expense.category = value.strip() if value and value.strip() else None

    if "amount" in values:
        expense.amount = values["amount"]

    if "payment_method" in values:
        value = values["payment_method"]

        expense.payment_method = value.strip() if value and value.strip() else None

    if "notes" in values:
        value = values["notes"]

        expense.notes = value.strip() if value and value.strip() else None

    db.commit()

    db.refresh(expense)

    return expense
