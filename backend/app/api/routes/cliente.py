from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_vendas import get_all_clientes, get_cliente_by_id, create_cliente, update_cliente, delete_cliente
from app.api.depends import get_db, get_read_user_admin, get_user_admin, get_admin
from app.database.models.models_vendas import User
from app.schemas.schemas_vendas import Cliente, ClienteCreate, ClienteUpdate

logger = logging.getLogger(__name__)

cliente_router = APIRouter(prefix="/cliente")

@cliente_router.get("/list", response_model=List[Cliente])
def list_clientes(db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)):
    try:
        logger.info(f"Clientes listados com sucesso pelo usuário: {current_user.username}")
        return get_all_clientes(db)
    except Exception as e:
        logger.error(f"Erro ao listar todos os clientes: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar clientes")

@cliente_router.get("/view/{cliente_id}", response_model=Cliente)
def view_cliente(cliente_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)):
    try:
        logger.info(f"Detalhes de Cliente recuperado com sucesso pelo usuário: {current_user.username}")
        return get_cliente_by_id(db, cliente_id)
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Erro ao listar o cliente {cliente_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar o cliente")

@cliente_router.post("/create", response_model=Cliente)
def add_cliente(cliente: ClienteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_user_admin)):
    try:
        logger.info(f"Clientes criado com sucesso pelo usuário: {current_user.username}")
        return create_cliente(db, cliente)
    except HTTPException as he:
        logger.error(f"Erro HTTP ao criar o cliente {cliente.nome_cliente}: {he.detail}")
        raise he
    except Exception as e:
        logger.error(f"Erro ao criar o novo cliente {cliente.nome_cliente}: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar o cliente")

@cliente_router.put("/update/{cliente_id}", response_model=Cliente)
def update_cliente(cliente_id: int, cliente: ClienteUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_user_admin)):
    try:
        logger.info(f"Clientes atualizado com sucesso pelo usuário: {current_user.username}")
        return update_cliente(db, cliente_id, cliente)
    except Exception as e:
        logger.error(f"Erro ao atualizar o cliente {cliente_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar o cliente")

@cliente_router.delete("/delete/{cliente_id}", response_model=Cliente)
def delete_cliente(cliente_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin)):
    try:
        logger.info(f"Clientes deletado com sucesso pelo usuário: {current_user.username}")
        return delete_cliente(db, cliente_id)
    except Exception as e:
        logger.error(f"Erro ao deletar o cliente {cliente_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao deletar o cliente")
