from datetime import (
    datetime,
    timedelta,
    timezone,
)

from uuid import UUID

import jwt

from argon2 import PasswordHasher

from app.core.config import settings

password_hasher = PasswordHasher()


def hash_password(
    password: str,
) -> str:
    return password_hasher.hash(password)


def verify_password(
    password: str,
    password_hash: str,
) -> bool:
    try:
        return password_hasher.verify(
            password_hash,
            password,
        )

    except Exception:
        return False


def create_access_token(
    user_id: UUID,
) -> str:
    now = datetime.now(timezone.utc)

    expires_at = now + timedelta(hours=(settings.access_token_expire_hours))

    payload = {
        "sub": str(user_id),
        "type": "access",
        "iat": now,
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        settings.secret_key,
        algorithm="HS256",
    )


def decode_access_token(
    token: str,
) -> UUID | None:
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=["HS256"],
        )

        if payload.get("type") != "access":
            return None

        subject = payload.get("sub")

        if not subject:
            return None

        return UUID(subject)

    except Exception:
        return None
