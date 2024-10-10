from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from dotenv import load_dotenv
import os

from app.database.models.models_vendas import User
from app.utils.hashing import get_password_hash, verify_password
from app.utils.validate_password import validate_password
from app.api.depends import get_db, oauth2_scheme

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')

change_password_router = APIRouter(prefix="/change-password")

@change_password_router.post("/")
def change_password(
    current_password: str,
    new_password: str,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == username).first()
    if user is None:
        raise credentials_exception

    if not verify_password(current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="A senha atual está incorreta",)

    if not validate_password(new_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A nova senha não atende aos requisitos de complexidade",)

    user.hashed_password = get_password_hash(new_password)
    db.commit()
    return {"message": "Senha alterada com sucesso"}
