from fastapi import HTTPException, status, logger
from sqlalchemy.orm import Session
from . import models, schemas
import logging

logger = logging.getLogger(__name__)

def get_all_clientes(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Cliente).offset(skip).limit(limit).all()

def get_cliente_by_id(db: Session, cliente_id: int):
    cliente = db.query(models.Cliente).filter(models.Cliente.id_cliente == cliente_id).first()
    if cliente is None:
        logger.error(f"Cliente não encontrado com o id: {cliente_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não existe")
    return cliente

def create_cliente(db: Session, cliente: schemas.ClienteCreate):
    try:
        if db.query(models.Cliente).filter(models.Cliente.nome_cliente == cliente.nome_cliente).first():
            logger.error(f"Tentativa de criar um cliente com o nome já existente: {cliente.nome_cliente}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cliente já registrado.")

        db_cliente = models.Cliente(nome_cliente=cliente.nome_cliente, cpf_cnpj=cliente.cpf_cnpj)
        db.add(db_cliente)
        db.commit()
        db.refresh(db_cliente)
        return db_cliente
    except Exception as e:
        logger.error(f"Erro ao criar o novo cliente {cliente.nome_cliente}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar o cliente.")

def update_cliente(db: Session, cliente_id: int, cliente: schemas.ClienteUpdate):
    clientes = get_cliente_by_id(db, cliente_id)

    clientes.nome_cliente = cliente.nome_cliente
    clientes.cpf_cnpj = cliente.cpf_cnpj

    db.commit()
    db.refresh(clientes)
    return clientes

def delete_cliente(db: Session, cliente_id: int):
    clientes = get_cliente_by_id(db, cliente_id)
    db.delete(clientes)
    db.commit()
    return clientes
