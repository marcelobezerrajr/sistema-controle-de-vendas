from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from datetime import timedelta
from dotenv import load_dotenv
import os
import logging

from app.services.services_user import (
    get_all_users,
    get_user_by_id,
    create_user,
    update_user,
    delete_user,
)
from app.schemas.schemas_user import UserForm, UserUpdateForm, UserOut
from app.schemas.schemas_response import UsersListResponse
from app.database.models.models_vendas import User
from app.api.depends import get_db, get_admin, get_user_admin, get_read_user_admin
from app.core.security import create_access_token
from app.utils.validate_password import validate_password

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

if not ACCESS_TOKEN_EXPIRE_MINUTES:
    raise ValueError(
        "ACCESS_TOKEN_EXPIRE_MINUTES devem ser definidos nas variáveis de ambiente"
    )

user_router = APIRouter(prefix="/user")


@user_router.get("/list", response_model=UsersListResponse)
def list_users_route(
    db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)
):
    try:
        users = get_all_users(db)
        logger.info(
            f"Usuários listados com sucesso pelo usuário: {current_user.username}"
        )
        return {
            "status": "success",
            "message": "Usuários listados com sucesso.",
            "data": [UserOut.from_orm(user) for user in users],
            "access_token": None,
            "token_type": None,
        }
    except Exception as e:
        logger.error(f"Erro ao lista usuários: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Ocorreu um erro enquanto listava os usuários."
        )


@user_router.get("/view/{id_user}", response_model=UsersListResponse)
def view_user_route(
    id_user: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_read_user_admin),
):
    try:
        user = get_user_by_id(db, id_user)
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": current_user.email}, expires_delta=access_token_expires
        )
        logger.info(
            f"Detalhes do usuário recuperados com sucesso pelo usuário: {current_user.username}"
        )
        return {
            "status": "success",
            "message": "Detalhes do usuário recuperados com sucesso.",
            "data": [UserOut.from_orm(user)],
            "access_token": access_token,
            "token_type": "bearer",
        }
    except Exception as e:
        logger.error(f"Erro ao visualizar usuário {current_user.username}: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Ocorreu um erro enquanto visualizava o usuário."
        )


@user_router.post("/create", response_model=UsersListResponse)
def create_user_route(
    db: Session = Depends(get_db),
    user_form: UserForm = Body(...),
    current_user: User = Depends(get_user_admin),
):
    try:
        if not validate_password(user_form.hashed_password):
            logger.warning(
                f"A senha não atende aos critérios do usuário {user_form.username}"
            )
            raise HTTPException(
                status_code=400, detail="A senha não atende aos critérios exigidos."
            )

        new_user = create_user(db, user_form)
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_form.email}, expires_delta=access_token_expires
        )
        logger.info(
            f"Usuário {new_user.email} criado com sucesso por {current_user.username}."
        )
        return {
            "status": "success",
            "message": "Usuário criado com sucesso!",
            "data": [UserOut.from_orm(new_user)],
            "access_token": access_token,
            "token_type": "bearer",
        }
    except HTTPException as he:
        logger.error(f"Erro HTTP ao criar usuário {user_form.username}: {he.detail}")
        raise he
    except Exception as e:
        logger.error(f"Erro ao criar usuário {user_form.username}: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Ocorreu um erro enquanto criava o usuário."
        )


@user_router.put("/update/{id_user}", response_model=UsersListResponse)
def update_user_route(
    id_user: int,
    user_form: UserUpdateForm,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_user_admin),
):
    try:
        user = update_user(db, id_user, user_form)
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": current_user.email}, expires_delta=access_token_expires
        )
        logger.info(
            f"Usuário atualizado com sucesso pelo usuário: {current_user.email}"
        )
        return {
            "status": "success",
            "message": "Usuário atualizado com sucesso!",
            "data": [UserOut.from_orm(user)],
            "access_token": access_token,
            "token_type": "bearer",
        }
    except Exception as e:
        logger.error(f"Erro ao atualizar usuário {user_form.email}: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Ocorreu um erro enquanto atualizava um usuário."
        )


@user_router.delete("/delete/{id_user}", response_model=UsersListResponse)
def delete_user_route(
    id_user: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin)
):
    try:
        user = delete_user(db, id_user)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": current_user.email}, expires_delta=access_token_expires
        )
        logger.info(
            f"Usuário excluído com sucesso pelo administrador: {current_user.username}"
        )
        return {
            "status": "success",
            "message": "Usuário excluído com sucesso!",
            "data": [UserOut.from_orm(user)],
            "access_token": access_token,
            "token_type": "bearer",
        }
    except Exception as e:
        logger.error(f"Erro ao excluir usuário {current_user.username}: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Ocorreu um erro enquanto deletava usuário."
        )
