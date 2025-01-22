from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_parcela import (
    create_parcela,
    update_parcela,
    get_all_parcelas,
    get_parcela_by_id,
)
from app.api.depends import get_db, get_read_user_admin, get_user_admin
from app.database.models.models_vendas import User
from app.schemas.schemas_parcela import Parcela, ParcelaCreate, ParcelaUpdate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

parcela_router = APIRouter(prefix="/parcela")


@parcela_router.get("/list", response_model=List[Parcela])
def list_parcelas_route(
    db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)
):
    try:
        logger.info(
            f"Parcelas listadas com sucesso pelo usuário: {current_user.username}"
        )
        return get_all_parcelas(db)
    except Exception as e:
        logger.error(f"Erro ao listar itens de venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar itens de venda.")


@parcela_router.get("/view/{id_parcela}", response_model=Parcela)
def view_item_venda_route(
    id_parcela: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_read_user_admin),
):
    try:
        logger.info(
            f"Parcela listada com sucesso pelo usuário: {current_user.username}"
        )
        return get_parcela_by_id(db, id_parcela)
    except Exception as e:
        logger.error(f"Erro ao listar parcela: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar parcela")


@parcela_router.post("/create", response_model=Parcela)
def add_parcela_route(
    parcela: ParcelaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_user_admin),
):
    try:
        logger.info(f"Parcela criada com sucesso pelo usuário: {current_user.username}")
        return create_parcela(db, parcela)
    except Exception as e:
        logger.error(f"Erro ao criar parcela: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar parcela.")


@parcela_router.put("/update/{id_parcela}", response_model=Parcela)
def update_parcela_route(
    id_parcela: int,
    parcela: ParcelaUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_user_admin),
):
    try:
        logger.info(
            f"Parcela atualizada com sucesso pelo usuário: {current_user.username}"
        )
        return update_parcela(db, id_parcela, parcela)
    except Exception as e:
        logger.error(f"Erro ao atualizar parcela: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar parcela.")


# @parcela_router.delete("/delete/{id_parcela}", response_model=Parcela)
# def delete_parcela_route(id_parcela: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin)):
#     try:
#         logger.info(f"Parcela deletado com sucesso pelo usuário: {current_user.username}")
#         return delete_parcela(db, id_parcela)
#     except Exception as e:
#         logger.error(f"Erro ao deletar o Parcela: {str(e)}")
#         raise HTTPException(status_code=500, detail="Erro ao deletar o Parcela")
