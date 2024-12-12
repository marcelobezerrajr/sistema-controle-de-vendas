from fastapi import HTTPException, status, logger
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import logging

from app.schemas.schemas_cliente import ClienteCreate, ClienteUpdate
from app.database.models.models_vendas import Cliente
from app.utils.check_exists_database import check_exists_database

logger = logging.getLogger(__name__)

def get_all_clientes(db: Session):
    return db.query(Cliente).all()

def get_cliente_by_id(db: Session, id_cliente: int):
    return check_exists_database(db, Cliente, 'id_cliente', id_cliente, "Cliente não encontrado")

def create_cliente(db: Session, cliente: ClienteCreate):
    try:
        db_cliente = Cliente(nome_cliente=cliente.nome_cliente, cpf_cnpj=cliente.cpf_cnpj)
        db.add(db_cliente)
        db.commit()
        db.refresh(db_cliente)
        return db_cliente
    except HTTPException as e:
        logger.error(f"Erro ao criar cliente (HTTP): {str(e)} - Cliente: {cliente}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar cliente {cliente.nome_cliente}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar o cliente.")

def update_cliente(db: Session, id_cliente: int, cliente: ClienteUpdate):
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
            detail="Erro ao atualizar o cliente no banco de dados"
        ) from e
    
    return db_cliente

def delete_cliente(db: Session, id_cliente: int):
    clientes = get_cliente_by_id(db, id_cliente)
    db.delete(clientes)
    db.commit()
    return clientes
