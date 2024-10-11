from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_vendas import create_comissao, get_all_comissoes
from app.api.depends import get_db, get_read_user_admin, get_user_admin
from app.database.models.models_vendas import User
from app.schemas.schemas_vendas import Comissao, ComissaoCreate

logger = logging.getLogger(__name__)

comissao_router = APIRouter(prefix="/comissao")

@comissao_router.get("/list", response_model=List[Comissao])
def list_comissoes_route(db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)):
    try:
        logger.info(f"Comissões listadas com sucesso pelo usuário: {current_user.username}")
        return get_all_comissoes(db)
    except Exception as e:
        logger.error(f"Erro ao listar itens de venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar itens de venda.")

@comissao_router.post("/create", response_model=Comissao)
def add_comissao_route(comissao: ComissaoCreate, db: Session = Depends(get_db), current_user: User = Depends(get_user_admin)):
    try:
        logger.info(f"Comissão criada com sucesso pelo usuário: {current_user.username}")
        return create_comissao(db, comissao)
    except Exception as e:
        logger.error(f"Erro ao criar comissão: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar comissão.")
