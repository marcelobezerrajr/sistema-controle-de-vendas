from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_vendas import get_all_fornecedores, get_fornecedor_by_id, create_fornecedor, update_fornecedor, delete_fornecedor
from app.api.depends import get_db
from app.schemas.schemas_vendas import Fornecedor, FornecedorCreate, FornecedorUpdate

logger = logging.getLogger(__name__)

fornecedor_router = APIRouter(prefix="/fornecedor")

@fornecedor_router.get("/list", response_model=List[Fornecedor])
def list_fornecedores(db: Session = Depends(get_db)):
    try:
        return get_all_fornecedores(db)
    except Exception as e:
        logger.error(f"Erro ao listar todos os forncedores: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar fornecedores")

@fornecedor_router.get("/view/{fornecedor_id}", response_model=Fornecedor)
def view_fornecedor(fornecedor_id: int, db: Session = Depends(get_db)):
    try:
        return get_fornecedor_by_id(db, fornecedor_id)
    except Exception as e:
        logger.error(f"Erro ao listar o fornecedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar o fornecedor")

@fornecedor_router.post("/create", response_model=Fornecedor)
def add_fornecedor(fornecedor: FornecedorCreate, db: Session = Depends(get_db)):
    try:
        return create_fornecedor(db, fornecedor)
    except Exception as e:
        logger.error(f"Erro ao criar o fornecedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar o fornecedor")

@fornecedor_router.put("/update/{fornecedor_id}", response_model=Fornecedor)
def update_fornecedor(fornecedor_id: int, fornecedor: FornecedorUpdate, db: Session = Depends(get_db)):
    try:
        return update_fornecedor(db, fornecedor_id, fornecedor)
    except Exception as e:
        logger.error(f"Erro ao atualizar o fornecedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar o fornecedor")

@fornecedor_router.delete("/delete/{fornecedor_id}", response_model=Fornecedor)
def delete_fornecedor(fornecedor_id: int, db: Session = Depends(get_db)):
    try:
        return delete_fornecedor(db, fornecedor_id)
    except Exception as e:
        logger.error(f"Erro ao deletar o fornecedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao deletar o fornecedor")
