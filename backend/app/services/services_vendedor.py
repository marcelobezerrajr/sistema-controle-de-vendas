from fastapi import HTTPException, status, logger
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import logging

from app.schemas.schemas_vendedor import VendedorCreate, VendedorUpdate
from app.database.models.models_vendas import Vendedor, VendedorEnum
from app.utils.check_exists_database import check_exists_database

logger = logging.getLogger(__name__)

def get_all_vendedores(db: Session):
    return db.query(Vendedor).all()

def get_vendedor_by_id(db: Session, id_vendedor: int):
    return check_exists_database(db, Vendedor, 'id_vendedor', id_vendedor, "Vendedor não encontrado")

def create_vendedor(db: Session, vendedor: VendedorCreate):
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
            percentual_comissao=percentual_comissao
        )
        
        db.add(db_vendedor)
        db.commit()
        db.refresh(db_vendedor)
        return db_vendedor
    except HTTPException as e:
        logger.error(f"Erro ao criar vendedor (HTTP): {str(e)} - Vendedor: {vendedor}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar vendedor {vendedor.nome_vendedor}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar o vendedor.")

def update_vendedor(db: Session, id_vendedor: int, vendedor: VendedorUpdate):
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
            detail="Erro ao atualizar o vendedor no banco de dados"
        ) from e

    return db_vendedor

def delete_vendedor(db: Session, id_vendedor: int):
    vendedor = get_vendedor_by_id(db, id_vendedor)
    db.delete(vendedor)
    db.commit()
    return vendedor
