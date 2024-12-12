from fastapi import HTTPException, status, logger
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import logging

from app.schemas.schemas_produto import ProdutoCreate, ProdutoUpdate
from app.database.models.models_vendas import Produto
from app.utils.check_exists_database import check_exists_database

logger = logging.getLogger(__name__)

def get_all_produtos(db: Session):
    return db.query(Produto).all()

def get_produto_by_id(db: Session, id_produto: int):
    return check_exists_database(db, Produto, 'id_produto', id_produto, "Produto não encontrado")

def create_produto(db: Session, produto: ProdutoCreate):
    try:
        db_produto = Produto(
            nome_produto=produto.nome_produto,
            descricao_produto=produto.descricao_produto,
            preco=produto.preco,
            tipo=produto.tipo
        )
        db.add(db_produto)
        db.commit()
        db.refresh(db_produto)
        return db_produto
    except HTTPException as e:
        logger.error(f"Erro ao criar produto (HTTP): {str(e)} - Produto: {produto}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar produto {produto.nome_produto}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar o produto.")

def update_produto(db: Session, id_produto: int, produto: ProdutoUpdate):
    db_produto = get_produto_by_id(db, id_produto)

    if produto.nome_produto:
        db_produto.nome_produto = produto.nome_produto
    if produto.descricao_produto:
        db_produto.descricao_produto = produto.descricao_produto
    if produto.preco:
        db_produto.preco = produto.preco
    if produto.tipo:
        db_produto.tipo = produto.tipo

    try:
        db.commit()
        db.refresh(db_produto)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar o produto no banco de dados"
        ) from e
    
    return db_produto

def delete_produto(db: Session, id_produto: int):
    produto = get_produto_by_id(db, id_produto)
    db.delete(produto)
    db.commit()
    return produto
