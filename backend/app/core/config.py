from pathlib import Path

from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict,
)

from pydantic import (
    field_validator,
)

BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_name: str = "Villa Imperial API"

    app_env: str = "development"

    database_url: str

    secret_key: str

    business_timezone: str = "America/Mazatlan"

    frontend_url: str = "http://localhost:5173"

    auth_cookie_name: str = "vi_session"

    access_token_expire_hours: int = 12

    cookie_secure: bool = False

    cookie_samesite: str = "lax"

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @field_validator(
        "database_url",
        mode="before",
    )
    @classmethod
    def normalize_database_url(
        cls,
        value: str,
    ):
        if isinstance(value, str) and value.startswith("postgresql://"):
            return value.replace(
                "postgresql://",
                "postgresql+psycopg://",
                1,
            )

        return value


settings = Settings()
