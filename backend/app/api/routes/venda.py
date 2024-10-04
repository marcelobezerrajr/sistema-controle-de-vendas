from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_crud import get_all_vendas, get_venda_by_id, create_venda, update_venda, delete_venda
from app.api.depends import get_db
from app.schemas.schemas import Venda, VendaCreate, VendaUpdate

logger = logging.getLogger(__name__)

venda_router = APIRouter(prefix="/venda")

@venda_router.get("/list", response_model=List[Venda])
def list_vendas(db: Session = Depends(get_db)):
    try:
        return get_all_vendas(db)
    except Exception as e:
        logger.error(f"Erro ao listar todas as vendas: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar vendas")

@venda_router.get("/view/{venda_id}", response_model=Venda)
def view_venda(venda_id: int, db: Session = Depends(get_db)):
    try:
        return get_venda_by_id(db, venda_id)
    except Exception as e:
        logger.error(f"Erro ao listar a venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar a venda")

@venda_router.post("/create", response_model=Venda)
def add_venda(venda: VendaCreate, db: Session = Depends(get_db)):
    try:
        return create_venda(db, venda)
    except Exception as e:
        logger.error(f"Erro ao criar a venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar a venda")

@venda_router.put("/update/{venda_id}", response_model=Venda)
def update_venda(venda_id: int, venda: VendaUpdate, db: Session = Depends(get_db)):
    try:
        return update_venda(db, venda_id, venda)
    except Exception as e:
        logger.error(f"Erro ao atualizar a venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar a venda")

@venda_router.delete("/delete/{venda_id}", response_model=Venda)
def delete_venda(venda_id: int, db: Session = Depends(get_db)):
    try:
        return delete_venda(db, venda_id)
    except Exception as e:
        logger.error(f"Erro ao deletar a venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao deletar a venda")
