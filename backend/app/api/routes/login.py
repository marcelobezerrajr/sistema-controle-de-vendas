from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import timedelta
from dotenv import load_dotenv
import os
import logging

from app.database.models.models_vendas import User
from app.core.security import create_access_token, oauth2_scheme
from app.utils.hashing import verify_password
from app.database.models.models_token import (
    Token,
    TokenData,
)
from app.api.depends import get_db

load_dotenv()

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

login_router = APIRouter(prefix="/login")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@login_router.post("/token", response_model=Token)
def login_for_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        logger.warning(
            f"Falha no login para {form_data.username}: Usuário não encontrado"
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
        )

    if not verify_password(form_data.password, user.hashed_password):
        logger.warning(f"Falha no login para {form_data.username}: Senha incorreta")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorreta",
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "permission": user.permission},
        expires_delta=access_token_expires,
    )
    logger.info(f"Usuário {user.email} logado com sucesso.")

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_username": user.username,
        "user_email": user.email,
        "user_permission": user.permission,
    }


@login_router.get("/me", response_model=TokenData)
def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token de acesso inválido",
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        permission: str = payload.get("permission", "read")

        if email is None:
            logger.warning("Carga útil do token faltando 'sub' (e-mail).")
            raise credentials_exception

        token_data = TokenData(email=email, permission=permission)
    except JWTError as e:
        logger.error(f"JWTError durante a solicitação /me: {e}")
        raise credentials_exception

    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        logger.warning(
            f"Falha na validação do token: usuário {token_data.email} não encontrado."
        )
        raise credentials_exception

    logger.info(f"Token validado com sucesso para o usuário {user.email}.")

    return {
        "email": user.email,
        "username": user.username,
        "permission": user.permission,
    }
