from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_crud import create_venda_vendedor, get_all_vendas_vendedor, get_vendas_by_vendedor
from app.api.depends import get_db
from app.schemas.schemas import VendaVendedor, VendaVendedorCreate

logger = logging.getLogger(__name__)

venda_vendedor_router = APIRouter(prefix="/venda-vendedor")

@venda_vendedor_router.get("/list", response_model=List[VendaVendedor])
def list_vendas_vendedor(db: Session = Depends(get_db)):
    try:
        return get_all_vendas_vendedor(db)
    except Exception as e:
        logger.error(f"Erro ao listar itens de venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar vendas-vendedor.")

@venda_vendedor_router.get("/vendedor/{id_vendedor}", response_model=list[VendaVendedor])
def gets_vendas_by_vendedor(id_vendedor: int, db: Session = Depends(get_db)):
    try:
        vendas = get_vendas_by_vendedor(db, id_vendedor)
        if not vendas:
            raise HTTPException(status_code=404, detail="Vendedor não encontrado ou sem vendas.")
        return vendas
    except Exception as e:
        logger.error(f"Erro ao listar vendas do vendedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar vendas do vendedor.")

@venda_vendedor_router.post("/create", response_model=VendaVendedor)
def add_venda_vendedor(venda_vendedor: VendaVendedorCreate, db: Session = Depends(get_db)):
    try:
        return create_venda_vendedor(db, venda_vendedor)
    except Exception as e:
        logger.error(f"Erro ao criar venda-vendedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar venda-vendedor.")
