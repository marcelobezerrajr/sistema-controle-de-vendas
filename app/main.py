from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import engine, get_db
from typing import List

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/readall/clientes/", response_model=List[schemas.Cliente])
def read_all_clientes(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    clientes = crud.get_all_clientes(db, skip=skip, limit=limit)
    return clientes

@app.get("/read/cliente/{cliente_id}", response_model=schemas.Cliente)
def read_cliente(cliente_id: int, db: Session = Depends(get_db)):
    db_cliente = crud.get_cliente(db, cliente_id)
    if db_cliente is None:
        raise HTTPException(status_code=404, detail="Cliente não existe")
    return db_cliente

@app.post("/create/cliente/", response_model=schemas.Cliente)
def create_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    return crud.create_cliente(db, cliente)

@app.put("/update/cliente/{cliente_id}", response_model=schemas.Cliente)
def update_cliente(cliente_id: int, cliente: schemas.ClienteUpdate, db: Session = Depends(get_db)):
    clientes = crud.update_cliente(db, cliente_id, cliente)
    if not clientes:
        raise HTTPException(status_code=404, detail="Cliente não existe")
    return clientes

@app.delete("/delete/cliente/{cliente_id}", response_model=schemas.Cliente)
def delete_cliente(cliente_id: int, db: Session = Depends(get_db)):
    clientes = crud.delete_cliente(db, cliente_id)
    if not clientes:
        raise HTTPException(status_code=404, detail="Cliente não existe")
    return clientes
