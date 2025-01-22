from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_custo import create_custo, get_all_custos, get_custo_by_id
from app.api.depends import get_db, get_read_user_admin, get_user_admin
from app.database.models.models_vendas import User
from app.schemas.schemas_custo import Custo, CustoCreate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

custo_router = APIRouter(prefix="/custo")


@custo_router.get("/list", response_model=List[Custo])
def list_custos_route(
    db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)
):
    try:
        logger.info(
            f"Custos listados com sucesso pelo usuário: {current_user.username}"
        )
        return get_all_custos(db)
    except Exception as e:
        logger.error(f"Erro ao listar itens de venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar itens de venda.")


@custo_router.get("/view/{id_custo}", response_model=Custo)
def view_custo_route(
    id_custo: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_read_user_admin),
):
    try:
        logger.info(f"Custo listado com sucesso pelo usuário: {current_user.username}")
        return get_custo_by_id(db, id_custo)
    except Exception as e:
        logger.error(f"Erro ao listar o custo: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar custo")


@custo_router.post("/create", response_model=Custo)
def add_custo_route(
    custo: CustoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_user_admin),
):
    try:
        logger.info(f"Custo criado com sucesso pelo usuário: {current_user.username}")
        return create_custo(db, custo)
    except Exception as e:
        logger.error(f"Erro ao criar custo: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar custo.")
