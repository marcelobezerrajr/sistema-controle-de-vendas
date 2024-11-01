from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_vendas import create_comissao, get_all_comissoes, get_comissao_by_id, calcular_comissao
from app.api.depends import get_db, get_read_user_admin, get_user_admin
from app.database.models.models_vendas import User
from app.schemas.schemas_vendas import Comissao, ComissaoCreate, CalculateComissao

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

@comissao_router.get("/view/{id_comissao}", response_model=Comissao)
def view_comissao_route(id_comissao: int, db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)):
    try:
        logger.info(f"Comissão listada com sucesso pelo usuário: {current_user.username}")
        return get_comissao_by_id(db, id_comissao)
    except Exception as e:
        logger.error(f"Erro ao listar comissão: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar comissão")

@comissao_router.post("/create", response_model=Comissao)
def add_comissao_route(comissao: ComissaoCreate, db: Session = Depends(get_db), current_user: User = Depends(get_user_admin)):
    try:
        logger.info(f"Comissão criada com sucesso pelo usuário: {current_user.username}")
        return create_comissao(db, comissao)
    except Exception as e:
        logger.error(f"Erro ao criar comissão: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar comissão.")
    
@comissao_router.get("/calculate/{id_vendedor}/{id_parcela}", response_model=CalculateComissao)
def calculate_comissao(id_vendedor: int, id_parcela: int, db: Session = Depends(get_db), current_user: User = Depends(get_user_admin)):
    try:
        logger.info(f"Comissão calculada com sucesso pelo usuário: {current_user.username}")
        comissao = calcular_comissao(db, id_vendedor, id_parcela)
        return comissao
    except Exception as e:
        logger.error(f"Erro ao calcular a comissão: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao calcular a comissão.")
