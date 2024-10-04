from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_crud import get_all_produtos, get_produto_by_id, create_produto, update_produto, delete_produto
from app.api.depends import get_db
from app.schemas.schemas import Produto, ProdutoCreate, ProdutoUpdate

logger = logging.getLogger(__name__)

produto_router = APIRouter(prefix="/produto")

@produto_router.get("/list", response_model=List[Produto])
def list_produtos(db: Session = Depends(get_db)):
    try:
        return get_all_produtos(db)
    except Exception as e:
        logger.error(f"Erro ao listar todos os produtos: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar produtos")

@produto_router.get("/view/{produto_id}", response_model=Produto)
def view_produto(produto_id: int, db: Session = Depends(get_db)):
    try:
        return get_produto_by_id(db, produto_id)
    except Exception as e:
        logger.error(f"Erro ao listar o produto: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar o produto")

@produto_router.post("/create", response_model=Produto)
def add_produto(produto: ProdutoCreate, db: Session = Depends(get_db)):
    try:
        return create_produto(db, produto)
    except Exception as e:
        logger.error(f"Erro ao criar o produto: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar o produto")

@produto_router.put("/update/{produto_id}", response_model=Produto)
def update_produto(produto_id: int, produto: ProdutoUpdate, db: Session = Depends(get_db)):
    try:
        return update_produto(db, produto_id, produto)
    except Exception as e:
        logger.error(f"Erro ao atualizar o produto: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar o produto")

@produto_router.delete("/delete/{produto_id}", response_model=Produto)
def delete_produto(produto_id: int, db: Session = Depends(get_db)):
    try:
        return delete_produto(db, produto_id)
    except Exception as e:
        logger.error(f"Erro ao deletar o produto: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao deletar o ")
