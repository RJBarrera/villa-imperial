from fastapi import (
    Cookie,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.core.config import settings

from app.core.security import (
    decode_access_token,
)

from app.db.session import get_db

from app.models.admin_user import (
    AdminUser,
)


def get_current_user(
    session_token: str | None = Cookie(
        default=None,
        alias=settings.auth_cookie_name,
    ),
    db: Session = Depends(get_db),
) -> AdminUser:
    credentials_exception = HTTPException(
        status_code=(status.HTTP_401_UNAUTHORIZED),
        detail=("La sesión no es válida " "o ha expirado."),
    )

    if not session_token:
        raise credentials_exception

    user_id = decode_access_token(session_token)

    if user_id is None:
        raise credentials_exception

    user = db.get(
        AdminUser,
        user_id,
    )

    if user is None or not user.is_active:
        raise credentials_exception

    return user
