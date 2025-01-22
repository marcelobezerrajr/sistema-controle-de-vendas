from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_vendedor import (
    get_vendedor_by_id,
    get_all_vendedores,
    create_vendedor,
    update_vendedor,
    delete_vendedor,
)
from app.api.depends import get_db, get_read_user_admin, get_user_admin, get_admin
from app.database.models.models_vendas import User
from app.schemas.schemas_vendedor import Vendedor, VendedorCreate, VendedorUpdate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

vendedor_router = APIRouter(prefix="/vendedor")


@vendedor_router.get("/list", response_model=List[Vendedor])
def list_vendedores_route(
    db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)
):
    try:
        logger.info(
            f"Vendedores listados com sucesso pelo usuário: {current_user.username}"
        )
        return get_all_vendedores(db)
    except Exception as e:
        logger.error(f"Erro ao listar todos os vendedores: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar vendedores")


@vendedor_router.get("/view/{id_vendedor}", response_model=Vendedor)
def view_vendedor_route(
    id_vendedor: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_read_user_admin),
):
    try:
        logger.info(
            f"Vendedo listado com sucesso pelo usuário: {current_user.username}"
        )
        return get_vendedor_by_id(db, id_vendedor)
    except Exception as e:
        logger.error(f"Erro ao listar o vendedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar o vendedor")


@vendedor_router.post("/create", response_model=Vendedor)
def add_vendedor_route(
    vendedor: VendedorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_user_admin),
):
    try:
        logger.info(
            f"Vendedor criado com sucesso pelo usuário: {current_user.username}"
        )
        return create_vendedor(db, vendedor)
    except Exception as e:
        logger.error(f"Erro ao criar o vendedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar o vendedor")


@vendedor_router.put("/update/{id_vendedor}", response_model=Vendedor)
def update_vendedor_route(
    id_vendedor: int,
    vendedor: VendedorUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_user_admin),
):
    try:
        logger.info(
            f"Vendedor atualizado com sucesso pelo usuário: {current_user.username}"
        )
        return update_vendedor(db, id_vendedor, vendedor)
    except Exception as e:
        logger.error(f"Erro ao atualizar o vendedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar o vendedor")


@vendedor_router.delete("/delete/{id_vendedor}", response_model=Vendedor)
def delete_vendedor_route(
    id_vendedor: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin),
):
    try:
        logger.info(
            f"Vendedor deletado com sucesso pelo usuário: {current_user.username}"
        )
        return delete_vendedor(db, id_vendedor)
    except Exception as e:
        logger.error(f"Erro ao deletar o vendedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao deletar o vendedor")
