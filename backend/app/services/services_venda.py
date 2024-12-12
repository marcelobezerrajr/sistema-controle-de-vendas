from fastapi import HTTPException, status, logger
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import logging

from app.schemas.schemas_venda import VendaCreate, VendaUpdate
from app.database.models.models_vendas import Venda, Cliente, Fornecedor
from app.utils.check_exists_database import check_exists_database

logger = logging.getLogger(__name__)

def get_all_vendas(db: Session):
    return db.query(Venda).all()

def get_venda_by_id(db: Session, id_venda: int):
    return check_exists_database(db, Venda, 'id_venda', id_venda, "Venda não encontrada")

def create_venda(db: Session, venda: VendaCreate):
    check_exists_database(db, Cliente, 'id_cliente', venda.id_cliente, "Cliente não encontrado")
    check_exists_database(db, Fornecedor, 'id_fornecedor', venda.id_fornecedor, "Fornecedor não encontrado")

    try:
        db_venda = Venda(
            tipo_venda=venda.tipo_venda,
            tipo_faturamento=venda.tipo_faturamento,
            valor_total=venda.valor_total,
            moeda=venda.moeda,
            valor_convertido=venda.valor_convertido,
            id_cliente=venda.id_cliente,
            id_fornecedor=venda.id_fornecedor
        )
        db.add(db_venda)
        db.commit()
        db.refresh(db_venda)
        return db_venda
    except HTTPException as e:
        logger.error(f"Erro ao criar venda (HTTP): {str(e)} - Venda: {venda}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar venda {venda}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar a venda.")

def update_venda(db: Session, id_venda: int, venda: VendaUpdate):
    db_venda = get_venda_by_id(db, id_venda)

    if venda.id_cliente:
        check_exists_database(db, Cliente, 'id_cliente', venda.id_cliente, "Cliente não encontrado")
        db_venda.id_cliente = venda.id_cliente

    if venda.id_fornecedor:
        check_exists_database(db, Fornecedor, 'id_fornecedor', venda.id_fornecedor, "Fornecedor não encontrado")
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
            detail="Erro ao atualizar a venda no banco de dados"
        ) from e

    return db_venda

def delete_venda(db: Session, id_venda: int):
    venda = get_venda_by_id(db, id_venda)
    db.delete(venda)
    db.commit()
    return venda
