from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import engine, get_db
from typing import List
import logging

logger = logging.getLogger(__name__)

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/readall/clientes/", response_model=List[schemas.Cliente])
def read_all_clientes(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    try:
        clientes = crud.get_all_clientes(db, skip=skip, limit=limit)
        return clientes
    except Exception as e:
        logger.error(f"Erro ao listar todos os clientes: {str(e)}")
        raise HTTPException(status_code=500, detail=(f"Ocorreu um erro ao listar todos os clientes - {e}."))

@app.get("/read/cliente/{cliente_id}", response_model=schemas.Cliente)
def read_cliente(cliente_id: int, db: Session = Depends(get_db)):
    try:
        return crud.get_cliente_by_id(db, cliente_id)
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Erro ao listar o cliente {cliente_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar o cliente.")

@app.post("/create/cliente/", response_model=schemas.Cliente)
def create_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    try:
        new_cliente = crud.create_cliente(db, cliente)
        return new_cliente
    except HTTPException as he:
        logger.error(f"Erro HTTP ao criar o cliente {cliente.nome_cliente}: {he.detail}")
        raise he
    except Exception as e:
        logger.error(f"Erro ao criar o novo cliente {cliente.nome_cliente}: {str(e)}")
        raise HTTPException(status_code=500, detail=(f"Ocorreu um erro ao criar o novo cliente - {e}."))

@app.put("/update/cliente/{cliente_id}", response_model=schemas.Cliente)
def update_cliente(cliente_id: int, cliente: schemas.ClienteUpdate, db: Session = Depends(get_db)):
    try:
        return crud.update_cliente(db, cliente_id, cliente)
    except Exception as e:
        logger.error(f"Erro ao atualizar o cliente {cliente_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Ocorreu um erro ao atualizar o cliente.")

@app.delete("/delete/cliente/{cliente_id}", response_model=schemas.Cliente)
def delete_cliente(cliente_id: int, db: Session = Depends(get_db)):
    try:
        return crud.delete_cliente(db, cliente_id)
    except Exception as e:
        logger.error(f"Erro ao deletar o cliente {cliente_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao deletar o cliente.")
