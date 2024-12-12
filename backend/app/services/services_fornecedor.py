from fastapi import HTTPException, status, logger
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import logging

from app.schemas.schemas_fornecedor import FornecedorCreate, FornecedorUpdate
from app.database.models.models_vendas import Fornecedor
from app.utils.check_exists_database import check_exists_database

logger = logging.getLogger(__name__)

def get_all_fornecedores(db: Session):
    return db.query(Fornecedor).all()

def get_fornecedor_by_id(db: Session, id_fornecedor: int):
    return check_exists_database(db, Fornecedor, 'id_fornecedor', id_fornecedor, "Fornecedor não encontrado")

def create_fornecedor(db: Session, fornecedor: FornecedorCreate):
    try:
        db_fornecedor = Fornecedor(
            nome_fornecedor=fornecedor.nome_fornecedor,
            percentual_comissao=fornecedor.percentual_comissao,
            impostos=fornecedor.impostos
        )
        db.add(db_fornecedor)
        db.commit()
        db.refresh(db_fornecedor)
        return db_fornecedor
    except HTTPException as e:
        logger.error(f"Erro ao criar fornecedor (HTTP): {str(e)} - Fornecedor: {fornecedor}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar fornecedor {fornecedor.nome_fornecedor}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar o fornecedor.")

def update_fornecedor(db: Session, id_fornecedor: int, fornecedor: FornecedorUpdate):
    db_fornecedor = get_fornecedor_by_id(db, id_fornecedor)

    if fornecedor.nome_fornecedor:
        db_fornecedor.nome_fornecedor = fornecedor.nome_fornecedor
    if fornecedor.percentual_comissao:
        db_fornecedor.percentual_comissao = fornecedor.percentual_comissao
    if fornecedor.impostos:
        db_fornecedor.impostos = fornecedor.impostos

    try:
        db.commit()
        db.refresh(db_fornecedor)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar o fornecedor no banco de dados"
        ) from e
    
    return db_fornecedor

def delete_fornecedor(db: Session, id_fornecedor: int):
    fornecedor = get_fornecedor_by_id(db, id_fornecedor)
    db.delete(fornecedor)
    db.commit()
    return fornecedor
