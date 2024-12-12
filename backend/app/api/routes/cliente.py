from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_cliente import get_all_clientes, get_cliente_by_id, create_cliente, update_cliente, delete_cliente
from app.api.depends import get_db, get_read_user_admin, get_user_admin, get_admin
from app.database.models.models_vendas import User
from app.schemas.schemas_cliente import Cliente, ClienteCreate, ClienteUpdate

logger = logging.getLogger(__name__)

cliente_router = APIRouter(prefix="/cliente")

@cliente_router.get("/list", response_model=List[Cliente])
def list_clientes_route(db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)):
    try:
        logger.info(f"Clientes listados com sucesso pelo usuário: {current_user.username}")
        return get_all_clientes(db)
    except Exception as e:
        logger.error(f"Erro ao listar todos os clientes: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar clientes")

@cliente_router.get("/view/{id_cliente}", response_model=Cliente)
def view_cliente_route(id_cliente: int, db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)):
    try:
        logger.info(f"Detalhes de Cliente recuperado com sucesso pelo usuário: {current_user.username}")
        return get_cliente_by_id(db, id_cliente)
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Erro ao listar o cliente {id_cliente}: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar o cliente")

@cliente_router.post("/create", response_model=Cliente)
def add_cliente_route(cliente: ClienteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_user_admin)):
    try:
        logger.info(f"Cliente criado com sucesso pelo usuário: {current_user.username}")
        return create_cliente(db, cliente)
    except HTTPException as he:
        logger.error(f"Erro HTTP ao criar o cliente {cliente.nome_cliente}: {he.detail}")
        raise he
    except Exception as e:
        logger.error(f"Erro ao criar o novo cliente {cliente.nome_cliente}: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar o cliente")

@cliente_router.put("/update/{id_cliente}", response_model=Cliente)
def update_cliente_route(id_cliente: int, cliente: ClienteUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_user_admin)):
    try:
        logger.info(f"Cliente atualizado com sucesso pelo usuário: {current_user.username}")
        return update_cliente(db, id_cliente, cliente)
    except Exception as e:
        logger.error(f"Erro ao atualizar o cliente {id_cliente}: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar o cliente")

@cliente_router.delete("/delete/{id_cliente}", response_model=Cliente)
def delete_cliente_route(id_cliente: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin)):
    try:
        logger.info(f"Cliente deletado com sucesso pelo usuário: {current_user.username}")
        return delete_cliente(db, id_cliente)
    except Exception as e:
        logger.error(f"Erro ao deletar o cliente {id_cliente}: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao deletar o cliente")
