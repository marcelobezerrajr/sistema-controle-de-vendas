from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import logging

from app.schemas.schemas_fornecedor import FornecedorCreate, FornecedorUpdate
from app.database.models.models_vendas import Fornecedor
from app.utils.check_exists_database import check_exists_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_all_fornecedores(db: Session):
    logger.info("Buscando todos os fornecedores.")
    fornecedores = db.query(Fornecedor).all()
    if not fornecedores:
        logger.warning("Nenhum fornecedor encontrado.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Nenhum fornecedor encontrado"
        )
    return fornecedores


def get_fornecedor_by_id(db: Session, id_fornecedor: int):
    return check_exists_database(
        db, Fornecedor, "id_fornecedor", id_fornecedor, "Fornecedor não encontrado"
    )


def create_fornecedor(db: Session, fornecedor: FornecedorCreate):
    logger.info(f"Criando fornecedor {fornecedor.nome_fornecedor}.")
    try:
        db_fornecedor = Fornecedor(
            nome_fornecedor=fornecedor.nome_fornecedor,
            percentual_comissao=fornecedor.percentual_comissao,
            impostos=fornecedor.impostos,
        )
        db.add(db_fornecedor)
        db.commit()
        db.refresh(db_fornecedor)
        logger.info(f"Fornecedor {fornecedor.nome_fornecedor} criado com sucesso.")
        return db_fornecedor
    except HTTPException as e:
        logger.error(
            f"Erro ao criar fornecedor (HTTP): {str(e)} - Fornecedor: {fornecedor}"
        )
        raise
    except Exception as e:
        logger.critical(
            f"Erro inesperado ao criar fornecedor {fornecedor.nome_fornecedor}: {str(e)}"
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar o fornecedor.",
        )


def update_fornecedor(db: Session, id_fornecedor: int, fornecedor: FornecedorUpdate):
    logger.info(f"Atualizando fornecedor com o ID {id_fornecedor}.")
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
            detail="Erro ao atualizar o fornecedor no banco de dados",
        ) from e

    logger.info(f"Fornecedor com o ID {id_fornecedor} atualizado com sucesso.")
    return db_fornecedor


def delete_fornecedor(db: Session, id_fornecedor: int):
    logger.info(f"Deletando fornecedor com o ID {id_fornecedor}.")
    fornecedor = get_fornecedor_by_id(db, id_fornecedor)

    db.delete(fornecedor)
    db.commit()
    logger.info(
        f"Fornecedor com ID {id_fornecedor} deletado com sucesso do banco de dados."
    )
    return fornecedor
