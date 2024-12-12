from fastapi import HTTPException, status, logger
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import logging

from app.schemas.schemas_venda_vendedor import VendaVendedorCreate
from app.database.models.models_vendas import VendaVendedor, Venda, Vendedor, TipoParticipacaoEnum
from app.utils.check_exists_database import check_exists_database

logger = logging.getLogger(__name__)

def get_all_vendas_vendedor(db: Session):
    return db.query(VendaVendedor).all()

def get_vendas_by_vendedor(db: Session, id_vendedor: int):
    return db.query(VendaVendedor).filter(VendaVendedor.id_vendedor == id_vendedor).all()

def get_venda_vendedor(db: Session, id_venda: int, id_vendedor: int):
    return db.query(VendaVendedor).filter(
        VendaVendedor.id_venda == id_venda,
        VendaVendedor.id_vendedor == id_vendedor
    ).first()

def create_venda_vendedor(db: Session, venda_vendedor: VendaVendedorCreate):
    try:
        check_exists_database(db, Venda, 'id_venda', venda_vendedor.id_venda, "Venda não encontrada")
        check_exists_database(db, Vendedor, 'id_vendedor', venda_vendedor.id_vendedor, "Vendedor não encontrado")

        existing_entry = db.query(VendaVendedor).filter(
            VendaVendedor.id_venda == venda_vendedor.id_venda,
            VendaVendedor.id_vendedor == venda_vendedor.id_vendedor
        ).first()

        if existing_entry:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Venda Vendedor já existe")

        if venda_vendedor.tipo_participacao == TipoParticipacaoEnum.inside_sales:
            percentual_comissao = 7.5
        elif venda_vendedor.tipo_participacao == TipoParticipacaoEnum.account_executive:
            percentual_comissao = 5.0
        else:
            raise ValueError(f"Tipo de vendedor inválido: {venda_vendedor.tipo_participacao}")

        db_venda_vendedor = VendaVendedor(
            tipo_participacao=venda_vendedor.tipo_participacao,
            percentual_comissao=percentual_comissao,
            id_venda=venda_vendedor.id_venda,
            id_vendedor=venda_vendedor.id_vendedor
        )

        db.add(db_venda_vendedor)
        db.commit()
        db.refresh(db_venda_vendedor)
        return db_venda_vendedor

    except HTTPException as e:
        logger.error(f"Erro ao criar venda vendedor (HTTP): {str(e)} - Venda Vendedor: {venda_vendedor}")
        raise
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Venda Vendedor já existe")
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar venda_vendedor {venda_vendedor}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar o venda vendedor.")

def delete_venda_vendedor(db: Session, id_venda: int, id_vendedor: int):
    venda_vendedor = db.query(VendaVendedor).filter(
        VendaVendedor.id_venda == id_venda,
        VendaVendedor.id_vendedor == id_vendedor
    ).first()
    if venda_vendedor:
        db.delete(venda_vendedor)
        db.commit()
    return venda_vendedor
