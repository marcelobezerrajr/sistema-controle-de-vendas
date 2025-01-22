from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from typing import List
import logging

from app.services.services_produto import (
    get_all_produtos,
    get_produto_by_id,
    create_produto,
    update_produto,
    delete_produto,
)
from app.api.depends import get_db, get_read_user_admin, get_user_admin, get_admin
from app.database.models.models_vendas import User
from app.schemas.schemas_produto import Produto, ProdutoCreate, ProdutoUpdate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

produto_router = APIRouter(prefix="/produto")


@produto_router.get("/list", response_model=List[Produto])
def list_produtos_route(
    db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)
):
    try:
        logger.info(
            f"Produtos listados com sucesso pelo usuário: {current_user.username}"
        )
        return get_all_produtos(db)
    except Exception as e:
        logger.error(f"Erro ao listar todos os produtos: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar produtos")


@produto_router.get("/view/{id_produto}", response_model=Produto)
def view_produto_route(
    id_produto: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_read_user_admin),
):
    try:
        logger.info(
            f"Produto listado com sucesso pelo usuário: {current_user.username}"
        )
        return get_produto_by_id(db, id_produto)
    except Exception as e:
        logger.error(f"Erro ao listar o produto: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar o produto")


@produto_router.post("/create", response_model=Produto)
def add_produto_route(
    produto: ProdutoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_user_admin),
):
    try:
        logger.info(f"Produto criado com sucesso pelo usuário: {current_user.username}")
        return create_produto(db, produto)
    except Exception as e:
        logger.error(f"Erro ao criar o produto: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar o produto")


@produto_router.put("/update/{id_produto}", response_model=Produto)
def update_produto_route(
    id_produto: int,
    produto: ProdutoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_user_admin),
):
    try:
        logger.info(
            f"Produto atualizado com sucesso pelo usuário: {current_user.username}"
        )
        return update_produto(db, id_produto, produto)
    except Exception as e:
        logger.error(f"Erro ao atualizar o produto: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar o produto")


@produto_router.delete("/delete/{id_produto}", response_model=Produto)
def delete_produto_route(
    id_produto: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin),
):
    try:
        logger.info(
            f"Produto deletado com sucesso pelo usuário: {current_user.username}"
        )
        return delete_produto(db, id_produto)
    except Exception as e:
        logger.error(f"Erro ao deletar o produto: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao deletar o ")
