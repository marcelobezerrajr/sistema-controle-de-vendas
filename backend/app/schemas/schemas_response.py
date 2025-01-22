from pydantic import BaseModel, EmailStr
from typing import List, Optional
from app.schemas.schemas_user import UserOut


class UsersListResponse(BaseModel):
    status: str
    message: str
    data: List[UserOut]
    access_token: Optional[str] = None
    token_type: Optional[str] = None


class EmailRequest(BaseModel):
    email: EmailStr


class TokenRequest(BaseModel):
    token: str


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
