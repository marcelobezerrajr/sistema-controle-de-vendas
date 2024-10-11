from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_vendas import get_all_vendas, get_venda_by_id, create_venda, update_venda, delete_venda
from app.api.depends import get_db, get_read_user_admin, get_user_admin, get_admin
from app.database.models.models_vendas import User
from app.schemas.schemas_vendas import Venda, VendaCreate, VendaUpdate

logger = logging.getLogger(__name__)

venda_router = APIRouter(prefix="/venda")

@venda_router.get("/list", response_model=List[Venda])
def list_vendas_route(db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)):
    try:
        logger.info(f"Vendas listadas com sucesso pelo usuário: {current_user.username}")
        return get_all_vendas(db)
    except Exception as e:
        logger.error(f"Erro ao listar todas as vendas: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar vendas")

@venda_router.get("/view/{id_venda}", response_model=Venda)
def view_venda_route(id_venda: int, db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)):
    try:
        logger.info(f"Venda listada com sucesso pelo usuário: {current_user.username}")
        return get_venda_by_id(db, id_venda)
    except Exception as e:
        logger.error(f"Erro ao listar a venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar a venda")

@venda_router.post("/create", response_model=Venda)
def add_venda_route(venda: VendaCreate, db: Session = Depends(get_db), current_user: User = Depends(get_user_admin)):
    try:
        logger.info(f"Venda criada com sucesso pelo usuário: {current_user.username}")
        return create_venda(db, venda)
    except Exception as e:
        logger.error(f"Erro ao criar a venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar a venda")

@venda_router.put("/update/{id_venda}", response_model=Venda)
def update_venda_route(id_venda: int, venda: VendaUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_user_admin)):
    try:
        logger.info(f"Venda atualizada com sucesso pelo usuário: {current_user.username}")
        return update_venda(db, id_venda, venda)
    except Exception as e:
        logger.error(f"Erro ao atualizar a venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar a venda")

@venda_router.delete("/delete/{id_venda}", response_model=Venda)
def delete_venda_route(id_venda: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin)):
    try:
        logger.info(f"Venda deletada com sucesso pelo usuário: {current_user.username}")
        return delete_venda(db, id_venda)
    except Exception as e:
        logger.error(f"Erro ao deletar a venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao deletar a venda")
