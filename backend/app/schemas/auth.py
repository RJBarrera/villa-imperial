from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class LoginRequest(BaseModel):
    username: str = Field(
        min_length=3,
        max_length=80,
    )

    password: str = Field(
        min_length=8,
        max_length=200,
    )


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID

    username: str

    full_name: str

    role: str
