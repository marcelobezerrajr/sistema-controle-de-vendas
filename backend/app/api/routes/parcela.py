from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_vendas import create_parcela, update_parcela, get_all_parcelas
from app.api.depends import get_db, get_read_user_admin, get_user_admin
from app.database.models.models_vendas import User
from app.schemas.schemas_vendas import Parcela, ParcelaCreate, ParcelaUpdate

logger = logging.getLogger(__name__)

parcela_router = APIRouter(prefix="/parcela")

@parcela_router.get("/list", response_model=List[Parcela])
def list_parcelas(db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)):
    try:
        logger.info(f"Parcelas listadas com sucesso pelo usuário: {current_user.username}")
        return get_all_parcelas(db)
    except Exception as e:
        logger.error(f"Erro ao listar itens de venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar itens de venda.")

@parcela_router.post("/create", response_model=Parcela)
def add_parcela(parcela: ParcelaCreate, db: Session = Depends(get_db), current_user: User = Depends(get_user_admin)):
    try:
        logger.info(f"Parcela criada com sucesso pelo usuário: {current_user.username}")
        return create_parcela(db, parcela)
    except Exception as e:
        logger.error(f"Erro ao criar parcela: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar parcela.")

@parcela_router.put("/update/{parcela_id}", response_model=Parcela)
def update_parcela(parcela_id: int, parcela: ParcelaUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_user_admin)):
    try:
        logger.info(f"Parcela atualizada com sucesso pelo usuário: {current_user.username}")
        return update_parcela(db, parcela_id, parcela)
    except Exception as e:
        logger.error(f"Erro ao atualizar parcela: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar parcela.")
