from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_fornecedor import get_all_fornecedores, get_fornecedor_by_id, create_fornecedor, update_fornecedor, delete_fornecedor
from app.api.depends import get_db, get_read_user_admin, get_user_admin, get_admin
from app.database.models.models_vendas import User
from app.schemas.schemas_fornecedor import Fornecedor, FornecedorCreate, FornecedorUpdate

logger = logging.getLogger(__name__)

fornecedor_router = APIRouter(prefix="/fornecedor")

@fornecedor_router.get("/list", response_model=List[Fornecedor])
def list_fornecedores_route(db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)):
    try:
        logger.info(f"Fornecedores listados com sucesso pelo usuário: {current_user.username}")
        return get_all_fornecedores(db)
    except Exception as e:
        logger.error(f"Erro ao listar todos os forncedores: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar fornecedores")

@fornecedor_router.get("/view/{id_fornecedor}", response_model=Fornecedor)
def view_fornecedor_route(id_fornecedor: int, db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)):
    try:
        logger.info(f"Fornecedor listado com sucesso pelo usuário: {current_user.username}")
        return get_fornecedor_by_id(db, id_fornecedor)
    except Exception as e:
        logger.error(f"Erro ao listar o fornecedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar o fornecedor")

@fornecedor_router.post("/create", response_model=Fornecedor)
def add_fornecedor_route(fornecedor: FornecedorCreate, db: Session = Depends(get_db), current_user: User = Depends(get_user_admin)):
    try:
        logger.info(f"Fornecedor criado com sucesso pelo usuário: {current_user.username}")
        return create_fornecedor(db, fornecedor)
    except Exception as e:
        logger.error(f"Erro ao criar o fornecedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar o fornecedor")

@fornecedor_router.put("/update/{id_fornecedor}", response_model=Fornecedor)
def update_fornecedor_route(id_fornecedor: int, fornecedor: FornecedorUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_user_admin)):
    try:
        logger.info(f"Fornecedor atualizado com sucesso pelo usuário: {current_user.username}")
        return update_fornecedor(db, id_fornecedor, fornecedor)
    except Exception as e:
        logger.error(f"Erro ao atualizar o fornecedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar o fornecedor")

@fornecedor_router.delete("/delete/{id_fornecedor}", response_model=Fornecedor)
def delete_fornecedor_route(id_fornecedor: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin)):
    try:
        logger.info(f"Fornecedor deletado com sucesso pelo usuário: {current_user.username}")
        return delete_fornecedor(db, id_fornecedor)
    except Exception as e:
        logger.error(f"Erro ao deletar o fornecedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao deletar o fornecedor")
