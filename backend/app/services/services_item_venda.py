from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import logging

from app.schemas.schemas_item_venda import ItemVendaCreate
from app.database.models.models_vendas import ItemVenda, Venda, Produto
from app.utils.check_exists_database import check_exists_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_all_itens_venda(db: Session):
    logger.info("Buscando todos os item venda.")
    item_venda = db.query(ItemVenda).all()
    if not item_venda:
        logger.warning("Nenhum item venda encontrado.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Nenhum item venda encontrado"
        )
    return item_venda


def get_item_venda_by_id(db: Session, id_item_venda: int):
    return check_exists_database(
        db, ItemVenda, "id_item_venda", id_item_venda, "Item Venda não encontrado"
    )


def create_item_venda(db: Session, item_venda: ItemVendaCreate):
    logger.info("Criando item_venda.")
    check_exists_database(
        db, Venda, "id_venda", item_venda.id_venda, "Venda não encontrada"
    )
    check_exists_database(
        db, Produto, "id_produto", item_venda.id_produto, "Produto não encontrado"
    )

    try:
        db_item_venda = ItemVenda(
            id_venda=item_venda.id_venda,
            id_produto=item_venda.id_produto,
            quantidade=item_venda.quantidade,
            preco_unitario=item_venda.preco_unitario,
            subtotal=item_venda.quantidade * item_venda.preco_unitario,
        )
        db.add(db_item_venda)
        db.commit()
        db.refresh(db_item_venda)
        logger.info("item_venda criado com sucesso.")
        return db_item_venda
    except HTTPException as e:
        logger.error(
            f"Erro ao criar item venda (HTTP): {str(e)} - Item Venda: {item_venda}"
        )
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar item venda {item_venda}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar o item venda.",
        )


def delete_item_venda(db: Session, id_item_venda: int):
    logger.info("Deletando item_venda.")
    item_venda = get_item_venda_by_id(db, id_item_venda)

    db.delete(item_venda)
    db.commit()
    logger.info(
        f"item_venda com ID {id_item_venda} deletado com sucesso do banco de dados."
    )
    return item_venda
