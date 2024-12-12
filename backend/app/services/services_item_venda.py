from fastapi import HTTPException, status, logger
from sqlalchemy.orm import Session
import logging

from app.schemas.schemas_item_venda import ItemVendaCreate
from app.database.models.models_vendas import ItemVenda, Venda, Produto
from app.utils.check_exists_database import check_exists_database

logger = logging.getLogger(__name__)

def get_all_itens_venda(db: Session):
    return db.query(ItemVenda).all()

def get_item_venda_by_id(db: Session, id_item_venda: int):
    return check_exists_database(db, ItemVenda, 'id_item_venda', id_item_venda, "Item Venda não encontrado")

def create_item_venda(db: Session, item_venda: ItemVendaCreate):
    check_exists_database(db, Venda, 'id_venda', item_venda.id_venda, "Venda não encontrada")
    check_exists_database(db, Produto, 'id_produto', item_venda.id_produto, "Produto não encontrado")

    try:
        db_item_venda = ItemVenda(
            id_venda=item_venda.id_venda,
            id_produto=item_venda.id_produto,
            quantidade=item_venda.quantidade,
            preco_unitario=item_venda.preco_unitario,
            subtotal=item_venda.quantidade * item_venda.preco_unitario
        )
        db.add(db_item_venda)
        db.commit()
        db.refresh(db_item_venda)
        return db_item_venda
    except HTTPException as e:
        logger.error(f"Erro ao criar item venda (HTTP): {str(e)} - Item Venda: {item_venda}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar item venda {item_venda}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar o item venda.")

def delete_item_venda(db: Session, id_item_venda: int):
    item_venda = get_item_venda_by_id(db, id_item_venda)
    db.delete(item_venda)
    db.commit()
    return item_venda
