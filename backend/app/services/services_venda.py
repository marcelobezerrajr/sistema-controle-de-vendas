from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import logging

from app.schemas.schemas_venda import VendaCreate, VendaUpdate
from app.database.models.models_vendas import Venda, Cliente, Fornecedor
from app.utils.check_exists_database import check_exists_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_all_vendas(db: Session):
    logger.info("Buscando todas as vendas.")
    vendas = db.query(Venda).all()
    if not vendas:
        logger.warning("Nenhuma venda encontrada.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Nenhuma venda encontrada"
        )
    return vendas


def get_venda_by_id(db: Session, id_venda: int):
    return check_exists_database(
        db, Venda, "id_venda", id_venda, "Venda não encontrada"
    )


def create_venda(db: Session, venda: VendaCreate):
    check_exists_database(
        db, Cliente, "id_cliente", venda.id_cliente, "Cliente não encontrado"
    )
    check_exists_database(
        db,
        Fornecedor,
        "id_fornecedor",
        venda.id_fornecedor,
        "Fornecedor não encontrado",
    )

    logger.info("Criando venda.")
    try:
        db_venda = Venda(
            tipo_venda=venda.tipo_venda,
            tipo_faturamento=venda.tipo_faturamento,
            valor_total=venda.valor_total,
            moeda=venda.moeda,
            valor_convertido=venda.valor_convertido,
            id_cliente=venda.id_cliente,
            id_fornecedor=venda.id_fornecedor,
        )
        db.add(db_venda)
        db.commit()
        db.refresh(db_venda)
        logger.info("Venda criada com sucesso.")
        return db_venda
    except HTTPException as e:
        logger.error(f"Erro ao criar venda (HTTP): {str(e)} - Venda: {venda}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar venda {venda}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar a venda.",
        )


def update_venda(db: Session, id_venda: int, venda: VendaUpdate):
    logger.info(f"Atualizando venda com o ID {id_venda}.")
    db_venda = get_venda_by_id(db, id_venda)

    if venda.id_cliente:
        check_exists_database(
            db, Cliente, "id_cliente", venda.id_cliente, "Cliente não encontrado"
        )
        db_venda.id_cliente = venda.id_cliente

    if venda.id_fornecedor:
        check_exists_database(
            db,
            Fornecedor,
            "id_fornecedor",
            venda.id_fornecedor,
            "Fornecedor não encontrado",
        )
        db_venda.id_fornecedor = venda.id_fornecedor

    if venda.tipo_venda:
        db_venda.tipo_venda = venda.tipo_venda
    if venda.tipo_faturamento:
        db_venda.tipo_faturamento = venda.tipo_faturamento
    if venda.valor_total:
        db_venda.valor_total = venda.valor_total
    if venda.moeda:
        db_venda.moeda = venda.moeda
    if venda.valor_convertido:
        db_venda.valor_convertido = venda.valor_convertido

    try:
        db.commit()
        db.refresh(db_venda)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar a venda no banco de dados",
        ) from e

    logger.info(f"Venda com o ID {id_venda} atualizada com sucesso.")
    return db_venda


def delete_venda(db: Session, id_venda: int):
    logger.info(f"Deletando venda com o ID {id_venda}.")
    venda = get_venda_by_id(db, id_venda)

    db.delete(venda)
    db.commit()
    logger.info(f"Venda com ID {id_venda} deletado com sucesso do banco de dados.")
    return venda
