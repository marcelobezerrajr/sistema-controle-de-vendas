from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_crud import create_comissao, get_all_comissoes
from app.api.depends import get_db
from app.schemas.schemas import Comissao, ComissaoCreate

logger = logging.getLogger(__name__)

comissao_router = APIRouter(prefix="/comissao")

@comissao_router.get("/list", response_model=List[Comissao])
def list_comissoes(db: Session = Depends(get_db)):
    try:
        return get_all_comissoes(db)
    except Exception as e:
        logger.error(f"Erro ao listar itens de venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar itens de venda.")

@comissao_router.post("/create", response_model=Comissao)
def add_comissao(comissao: ComissaoCreate, db: Session = Depends(get_db)):
    try:
        return create_comissao(db, comissao)
    except Exception as e:
        logger.error(f"Erro ao criar comissão: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar comissão.")
