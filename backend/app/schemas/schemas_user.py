from pydantic import BaseModel, EmailStr, validator
from typing import Optional
import re

from app.database.models.models_vendas import PermissionType
from app.utils.hashing import get_password_hash
from app.utils.validate_password import validate_password

class UserForm(BaseModel):
    username: str
    email: EmailStr
    hashed_password: str
    permission: PermissionType

    class Config:
        from_attributes = True

    @validator('username')
    def validate_user(cls, value):
        if not re.match(r'^[a-zA-Z0-9]+$', value):
            raise ValueError('Username format invalid')
        return value

    @validator('hashed_password', pre=True)
    def validate_and_hash_password(cls, value):
        validate_password(value)
        return get_password_hash(value)

class UserUpdateForm(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    hashed_password: Optional[str] = None
    permission: Optional[PermissionType] = None

    class Config:
        from_attributes = True

    @validator('username')
    def validate_user(cls, value):
        if value and not re.match(r'^[a-zA-Z0-9]+$', value):
            raise ValueError('User format invalid')
        return value
    
class UserOut(BaseModel):
    id: int
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    permission: PermissionType

    class Config:
        from_attributes = True
