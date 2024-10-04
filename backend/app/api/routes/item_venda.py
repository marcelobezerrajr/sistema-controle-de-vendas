from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_crud import create_item_venda, get_all_itens_venda, delete_item_venda
from app.api.depends import get_db
from app.schemas.schemas import ItemVenda, ItemVendaCreate

logger = logging.getLogger(__name__)

item_venda_router = APIRouter(prefix="/itemvenda")

@item_venda_router.get("/list", response_model=List[ItemVenda])
def list_itens_venda(db: Session = Depends(get_db)):
    try:
        return get_all_itens_venda(db)
    except Exception as e:
        logger.error(f"Erro ao listar itens de venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar itens de venda.")

@item_venda_router.post("/create", response_model=ItemVenda)
def add_item_venda(item_venda: ItemVendaCreate, db: Session = Depends(get_db)):
    try:
        return create_item_venda(db, item_venda)
    except Exception as e:
        logger.error(f"Erro ao adicionar item à venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar item de venda.")

# @item_venda_router.delete("/delete/{id_item_venda}", response_model=ItemVenda)
# def deletar_item_venda(id_item_venda: int, db: Session = Depends(get_db)):
#     try:
#         return delete_item_venda(db, id_item_venda)
#     except Exception as e:
#         logger.error(f"Erro ao deletar o item venda {id_item_venda}: {str(e)}")
#         raise HTTPException(status_code=500, detail="Erro ao deletar o item venda")
