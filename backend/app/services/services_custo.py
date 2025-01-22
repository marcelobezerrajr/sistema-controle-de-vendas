from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import logging

from app.schemas.schemas_custo import CustoCreate
from app.database.models.models_vendas import Custo, Venda
from app.utils.check_exists_database import check_exists_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_all_custos(db: Session):
    logger.info("Buscando todos os custos.")
    custos = db.query(Custo).all()
    if not custos:
        logger.warning("Nenhum custo encontrado.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Nenhum custo encontrado"
        )
    return custos


def get_custo_by_id(db: Session, id_custo: int):
    return check_exists_database(
        db, Custo, "id_custo", id_custo, "Custo não encontrado"
    )


def create_custo(db: Session, custo: CustoCreate):
    logger.info("Criando custo.")
    try:
        check_exists_database(
            db, Venda, "id_venda", custo.id_venda, "Venda não encontrada"
        )

        db_custo = Custo(
            descricao=custo.descricao, valor=custo.valor, id_venda=custo.id_venda
        )

        db.add(db_custo)
        db.commit()
        db.refresh(db_custo)
        logger.info("Custo criado com sucesso.")
        return db_custo
    except HTTPException as e:
        logger.error(f"Erro ao criar custo (HTTP): {str(e)} - Custo: {custo}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar Custo {custo}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar o Custo.",
        )
