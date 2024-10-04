from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_vendas import create_custo, get_all_custos
from app.api.depends import get_db
from app.schemas.schemas_vendas import Custo, CustoCreate

logger = logging.getLogger(__name__)

custo_router = APIRouter(prefix="/custo")

@custo_router.get("/list", response_model=List[Custo])
def list_custos(db: Session = Depends(get_db)):
    try:
        return get_all_custos(db)
    except Exception as e:
        logger.error(f"Erro ao listar itens de venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar itens de venda.")

@custo_router.post("/create", response_model=Custo)
def add_custo(custo: CustoCreate, db: Session = Depends(get_db)):
    try:
        return create_custo(db, custo)
    except Exception as e:
        logger.error(f"Erro ao criar custo: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar custo.")
