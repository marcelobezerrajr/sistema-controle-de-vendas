from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import logging

from app.schemas.schemas_cliente import ClienteCreate, ClienteUpdate
from app.database.models.models_vendas import Cliente
from app.utils.check_exists_database import check_exists_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_all_clientes(db: Session):
    logger.info("Buscando todos os clientes.")
    clientes = db.query(Cliente).all()
    if not clientes:
        logger.warning("Nenhum cliente encontrado.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Nenhum cliente encontrado"
        )
    return clientes


def get_cliente_by_id(db: Session, id_cliente: int):
    return check_exists_database(
        db, Cliente, "id_cliente", id_cliente, "Cliente não encontrado"
    )


def create_cliente(db: Session, cliente: ClienteCreate):
    logger.info(f"Criando cliente {cliente.nome_cliente}.")
    try:
        db_cliente = Cliente(
            nome_cliente=cliente.nome_cliente, cpf_cnpj=cliente.cpf_cnpj
        )
        db.add(db_cliente)
        db.commit()
        db.refresh(db_cliente)
        logger.info(f"Cliente {cliente.nome_cliente} criado com sucesso.")
        return db_cliente
    except HTTPException as e:
        logger.error(f"Erro ao criar cliente (HTTP): {str(e)} - Cliente: {cliente}")
        raise
    except Exception as e:
        logger.critical(
            f"Erro inesperado ao criar cliente {cliente.nome_cliente}: {str(e)}"
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar o cliente.",
        )


def update_cliente(db: Session, id_cliente: int, cliente: ClienteUpdate):
    logger.info(f"Atualizando cliente com o ID {id_cliente}.")
    db_cliente = get_cliente_by_id(db, id_cliente)

    if cliente.nome_cliente:
        db_cliente.nome_cliente = cliente.nome_cliente
    if cliente.cpf_cnpj:
        db_cliente.cpf_cnpj = cliente.cpf_cnpj

    try:
        db.commit()
        db.refresh(db_cliente)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar o cliente no banco de dados",
        ) from e

    logger.info(f"Cliente com o ID {id_cliente} atualizado com sucesso.")
    return db_cliente


def delete_cliente(db: Session, id_cliente: int):
    logger.info(f"Deletando cliente com o ID {id_cliente}.")
    clientes = get_cliente_by_id(db, id_cliente)

    db.delete(clientes)
    db.commit()
    logger.info(f"Cliente com ID {id_cliente} deletado com sucesso do banco de dados.")
    return clientes
