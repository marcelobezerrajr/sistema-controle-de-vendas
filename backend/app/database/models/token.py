from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str
    user_username: str
    user_name: str
    user_email: str
    user_permission: str

class TokenData(BaseModel):
    email: str | None = None
    username: str | None = None
    name: str | None = None
    permission: str | None = None

    class Config:
        from_attributes = True
