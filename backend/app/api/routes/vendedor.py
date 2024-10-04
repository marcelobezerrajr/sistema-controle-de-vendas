from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_crud import get_vendedor_by_id, get_all_vendedores, create_vendedor, update_vendedor, delete_vendedor
from app.api.depends import get_db
from app.schemas.schemas import Vendedor, VendedorCreate, VendedorUpdate

logger = logging.getLogger(__name__)

vendedor_router = APIRouter(prefix="/vendedor")

@vendedor_router.get("/list", response_model=List[Vendedor])
def list_vendedores(db: Session = Depends(get_db)):
    try:
        return get_all_vendedores(db)
    except Exception as e:
        logger.error(f"Erro ao listar todos os vendedores: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar vendedores")

@vendedor_router.get("/view/{vendedor_id}", response_model=Vendedor)
def view_vendedor(vendedor_id: int, db: Session = Depends(get_db)):
    try:
        return get_vendedor_by_id(db, vendedor_id)
    except Exception as e:
        logger.error(f"Erro ao listar o vendedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar o vendedor")

@vendedor_router.post("/create", response_model=Vendedor)
def add_vendedor(vendedor: VendedorCreate, db: Session = Depends(get_db)):
    try:
        return create_vendedor(db, vendedor)
    except Exception as e:
        logger.error(f"Erro ao criar o vendedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar o vendedor")

@vendedor_router.put("/update/{vendedor_id}", response_model=Vendedor)
def update_vendedor(vendedor_id: int, vendedor: VendedorUpdate, db: Session = Depends(get_db)):
    try:
        return update_vendedor(db, vendedor_id, vendedor)
    except Exception as e:
        logger.error(f"Erro ao atualizar o vendedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar o vendedor")

@vendedor_router.delete("/delete/{vendedor_id}", response_model=Vendedor)
def delete_vendedor(vendedor_id: int, db: Session = Depends(get_db)):
    try:
        return delete_vendedor(db, vendedor_id)
    except Exception as e:
        logger.error(f"Erro ao deletar o vendedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao deletar o vendedor")
