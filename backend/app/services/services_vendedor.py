from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import logging

from app.schemas.schemas_vendedor import VendedorCreate, VendedorUpdate
from app.database.models.models_vendas import Vendedor, VendedorEnum
from app.utils.check_exists_database import check_exists_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_all_vendedores(db: Session):
    logger.info("Buscando todos os vendedores.")
    vendedores = db.query(Vendedor).all()
    if not vendedores:
        logger.warning("Nenhum vendedor encontrado.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Nenhum vendedor encontrado"
        )
    return vendedores


def get_vendedor_by_id(db: Session, id_vendedor: int):
    return check_exists_database(
        db, Vendedor, "id_vendedor", id_vendedor, "Vendedor não encontrado"
    )


def create_vendedor(db: Session, vendedor: VendedorCreate):
    logger.info(f"Criando vendedor {vendedor.nome_vendedor}.")
    try:
        if vendedor.tipo == VendedorEnum.inside_sales:
            percentual_comissao = 7.5
        elif vendedor.tipo == VendedorEnum.account_executive:
            percentual_comissao = 5.0
        else:
            raise ValueError(f"Tipo de vendedor inválido: {vendedor.tipo}")

        db_vendedor = Vendedor(
            nome_vendedor=vendedor.nome_vendedor,
            tipo=vendedor.tipo,
            percentual_comissao=percentual_comissao,
        )

        db.add(db_vendedor)
        db.commit()
        db.refresh(db_vendedor)
        logger.info(f"Vendedor {vendedor.nome_vendedor} criado com sucesso.")
        return db_vendedor
    except HTTPException as e:
        logger.error(f"Erro ao criar vendedor (HTTP): {str(e)} - Vendedor: {vendedor}")
        raise
    except Exception as e:
        logger.critical(
            f"Erro inesperado ao criar vendedor {vendedor.nome_vendedor}: {str(e)}"
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar o vendedor.",
        )


def update_vendedor(db: Session, id_vendedor: int, vendedor: VendedorUpdate):
    logger.info(f"Atualizando vendedor com o ID {id_vendedor}.")
    db_vendedor = get_vendedor_by_id(db, id_vendedor)

    if vendedor.nome_vendedor:
        db_vendedor.nome_vendedor = vendedor.nome_vendedor
    if vendedor.tipo:
        db_vendedor.tipo = vendedor.tipo

    if vendedor.tipo == VendedorEnum.inside_sales:
        db_vendedor.percentual_comissao = 7.5
    elif vendedor.tipo == VendedorEnum.account_executive:
        db_vendedor.percentual_comissao = 5.0
    else:
        raise ValueError(f"Tipo de vendedor inválido: {vendedor.tipo}")

    try:
        db.commit()
        db.refresh(db_vendedor)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar o vendedor no banco de dados",
        ) from e

    logger.info(f"Vendedor com o ID {id_vendedor} atualizado com sucesso.")
    return db_vendedor


def delete_vendedor(db: Session, id_vendedor: int):
    logger.info(f"Deletando vendedor com o ID {id_vendedor}.")
    vendedor = get_vendedor_by_id(db, id_vendedor)

    db.delete(vendedor)
    db.commit()
    logger.info(
        f"Vendedor com ID {id_vendedor} deletado com sucesso do banco de dados."
    )
    return vendedor
