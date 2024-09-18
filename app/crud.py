from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from . import models, schemas

def get_all_clientes(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Cliente).offset(skip).limit(limit).all()

def get_cliente(db: Session, cliente_id: int):
    return db.query(models.Cliente).filter(models.Cliente.id_cliente == cliente_id).first()

def create_cliente(db: Session, cliente: schemas.ClienteCreate):
    try:
        db_cliente = models.Cliente(nome_cliente=cliente.nome_cliente, cpf_cnpj=cliente.cpf_cnpj)
        db.add(db_cliente)
        db.commit()
        db.refresh(db_cliente)
        return db_cliente
    except Exception:
        raise 

def update_cliente(db: Session, cliente_id: int, cliente: schemas.ClienteUpdate):
    clientes = get_cliente(db, cliente_id)
    if not clientes:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não existe")
    clientes.nome_cliente = cliente.nome_cliente
    clientes.cpf_cnpj = cliente.cpf_cnpj

    db.commit()
    db.refresh(clientes)
    return clientes

def delete_cliente(db: Session, cliente_id: int):
    clientes = get_cliente(db, cliente_id)
    if not clientes:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não existe")
    db.delete(clientes)
    db.commit()
    return clientes
