from datetime import (
    datetime,
    timezone,
)

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response,
    status,
)

from sqlalchemy import select

from sqlalchemy.orm import Session

from app.core.auth import (
    get_current_user,
)

from app.core.config import settings

from app.core.security import (
    create_access_token,
    verify_password,
)

from app.db.session import get_db

from app.models.admin_user import (
    AdminUser,
)

from app.schemas.auth import (
    LoginRequest,
    UserResponse,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/login",
    response_model=UserResponse,
)
def login(
    data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    username = data.username.strip().lower()

    user = db.scalar(select(AdminUser).where(AdminUser.username == username))

    if (
        user is None
        or not user.is_active
        or not verify_password(
            data.password,
            user.password_hash,
        )
    ):
        raise HTTPException(
            status_code=(status.HTTP_401_UNAUTHORIZED),
            detail=("Usuario o contraseña " "incorrectos."),
        )

    token = create_access_token(user.id)

    max_age = settings.access_token_expire_hours * 60 * 60

    response.set_cookie(
        key=(settings.auth_cookie_name),
        value=token,
        httponly=True,
        secure=(settings.cookie_secure),
        samesite=(settings.cookie_samesite),
        max_age=max_age,
        path="/",
    )

    user.last_login_at = datetime.now(timezone.utc)

    db.commit()

    return user


@router.post(
    "/logout",
)
def logout(
    response: Response,
):
    response.delete_cookie(
        key=(settings.auth_cookie_name),
        path="/",
        secure=(settings.cookie_secure),
        samesite=(settings.cookie_samesite),
    )

    return {"message": "Sesión cerrada correctamente."}


@router.get(
    "/me",
    response_model=UserResponse,
)
def me(
    current_user: AdminUser = Depends(get_current_user),
):
    return current_user
