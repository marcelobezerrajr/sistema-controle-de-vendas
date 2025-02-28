from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os
import logging

from app.database.models.models_vendas import User
from app.schemas.schemas_user import UserForm, UserOut
from app.schemas.schemas_response import UsersListResponse
from app.core.security import create_access_token
from app.api.depends import get_db

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

if not ACCESS_TOKEN_EXPIRE_MINUTES:
    raise ValueError(
        "ACCESS_TOKEN_EXPIRE_MINUTES must be defined in environment variables"
    )

register_router = APIRouter(prefix="/register")


@register_router.post("", response_model=UsersListResponse)
def register_user(user_form: UserForm, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_form.email).first()
    if user:
        logger.warning(f"Tentativa de registro com e-mail existente: {user_form.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="E-mail já cadastrado"
        )

    new_user = User(
        username=user_form.username,
        email=user_form.email,
        hashed_password=user_form.hashed_password,
        permission=user_form.permission,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )
    logger.info(f"Usuário registrado com sucesso: {new_user.email}")
    return {
        "status": "success",
        "message": "Usuário registrado com sucesso!",
        "data": [UserOut.from_orm(new_user)],
        "access_token": access_token,
        "token_type": "bearer",
    }
