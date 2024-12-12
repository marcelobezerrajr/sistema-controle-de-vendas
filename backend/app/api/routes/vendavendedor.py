from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_venda_vendedor import create_venda_vendedor, get_all_vendas_vendedor, get_vendas_by_vendedor, get_venda_vendedor
from app.api.depends import get_db, get_read_user_admin, get_user_admin
from app.database.models.models_vendas import User
from app.schemas.schemas_venda_vendedor import VendaVendedor, VendaVendedorCreate

logger = logging.getLogger(__name__)

venda_vendedor_router = APIRouter(prefix="/venda-vendedor")

@venda_vendedor_router.get("/list", response_model=List[VendaVendedor])
def list_vendas_vendedor_route(db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)):
    try:
        logger.info(f"Venda vendedor listados com sucesso pelo usuário: {current_user.username}")
        return get_all_vendas_vendedor(db)
    except Exception as e:
        logger.error(f"Erro ao listar itens de venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar vendas-vendedor.")

@venda_vendedor_router.get("/view/{id_vendedor}", response_model=list[VendaVendedor])
def gets_vendas_by_vendedor_route(id_vendedor: int, db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)):
    try:
        vendas = get_vendas_by_vendedor(db, id_vendedor)
        if not vendas:
            raise HTTPException(status_code=404, detail="Vendedor não encontrado ou sem vendas.")
        logger.info(f"Vendas do vendedor listado com sucesso pelo usuário: {current_user.username}")
        return vendas
    except Exception as e:
        logger.error(f"Erro ao listar vendas do vendedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar vendas do vendedor.")
    
@venda_vendedor_router.get("/view/{id_venda}/{id_vendedor}", response_model=VendaVendedor)
def view_venda_vendedor_route(id_venda: int, id_vendedor: int, db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)):
    try:
        venda_vendedor = get_venda_vendedor(db, id_venda, id_vendedor)
        if not venda_vendedor:
            raise HTTPException(status_code=404, detail="Venda Vendedor não encontrada.")
        logger.info(f"Venda Vendedor visualizada com sucesso pelo usuário: {current_user.username}")
        return venda_vendedor
    except Exception as e:
        logger.error(f"Erro ao visualizar Venda Vendedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao visualizar Venda Vendedor.")

@venda_vendedor_router.post("/create", response_model=VendaVendedor)
def add_venda_vendedor_route(venda_vendedor: VendaVendedorCreate, db: Session = Depends(get_db), current_user: User = Depends(get_user_admin)):
    try:
        logger.info(f"Venda vendedor criada com sucesso pelo usuário: {current_user.username}")
        return create_venda_vendedor(db, venda_vendedor)
    except Exception as e:
        logger.error(f"Erro ao criar venda-vendedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar venda-vendedor.")
