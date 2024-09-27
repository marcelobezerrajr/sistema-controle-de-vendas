from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import logging

from app import models, schemas, crud
from app.database import engine, get_db

logger = logging.getLogger(__name__)

models.Base.metadata.create_all(bind=engine)

app = FastAPI(docs_url="/docs", redoc_url="/redoc")

origins = [
    "http://localhost:3001"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def root():
    return {"message": "Go to /docs!"}

@app.get("/readall/clientes/", response_model=List[schemas.Cliente])
def read_all_clientes(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    try:
        return crud.get_all_clientes(db, skip=skip, limit=limit)
    except Exception as e:
        logger.error(f"Erro ao listar todos os clientes: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar clientes")

@app.get("/read/cliente/{cliente_id}", response_model=schemas.Cliente)
def read_cliente(cliente_id: int, db: Session = Depends(get_db)):
    try:
        return crud.get_cliente_by_id(db, cliente_id)
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Erro ao listar o cliente {cliente_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar o cliente")

@app.post("/create/cliente/", response_model=schemas.Cliente)
def create_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_cliente(db, cliente)
    except HTTPException as he:
        logger.error(f"Erro HTTP ao criar o cliente {cliente.nome_cliente}: {he.detail}")
        raise he
    except Exception as e:
        logger.error(f"Erro ao criar o novo cliente {cliente.nome_cliente}: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar o cliente")

@app.put("/update/cliente/{cliente_id}", response_model=schemas.Cliente)
def update_cliente(cliente_id: int, cliente: schemas.ClienteUpdate, db: Session = Depends(get_db)):
    try:
        return crud.update_cliente(db, cliente_id, cliente)
    except Exception as e:
        logger.error(f"Erro ao atualizar o cliente {cliente_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar o cliente")

@app.delete("/delete/cliente/{cliente_id}", response_model=schemas.Cliente)
def delete_cliente(cliente_id: int, db: Session = Depends(get_db)):
    try:
        return crud.delete_cliente(db, cliente_id)
    except Exception as e:
        logger.error(f"Erro ao deletar o cliente {cliente_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao deletar o cliente")

@app.post("/create/item_venda/", response_model=schemas.ItemVenda)
def create_item_venda(item_venda: schemas.ItemVendaCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_item_venda(db, item_venda)
    except Exception as e:
        logger.error(f"Erro ao adicionar item à venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar item de venda.")

@app.get("/readall/item_venda/", response_model=List[schemas.ItemVenda])
def read_all_itens_venda(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    try:
        return crud.get_all_itens_venda(db, skip=skip, limit=limit)
    except Exception as e:
        logger.error(f"Erro ao listar itens de venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar itens de venda.")

@app.post("/create/parcela/", response_model=schemas.Parcela)
def create_parcela(parcela: schemas.ParcelaCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_parcela(db, parcela)
    except Exception as e:
        logger.error(f"Erro ao criar parcela: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar parcela.")

@app.put("/update/parcela/{parcela_id}", response_model=schemas.Parcela)
def update_parcela(parcela_id: int, parcela: schemas.ParcelaUpdate, db: Session = Depends(get_db)):
    try:
        return crud.update_parcela(db, parcela_id, parcela)
    except Exception as e:
        logger.error(f"Erro ao atualizar parcela: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar parcela.")

@app.post("/create/comissao/", response_model=schemas.Comissao)
def create_comissao(comissao: schemas.ComissaoCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_comissao(db, comissao)
    except Exception as e:
        logger.error(f"Erro ao criar comissão: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar comissão.")

@app.post("/create/custo/", response_model=schemas.Custo)
def create_custo(custo: schemas.CustoCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_custo(db, custo)
    except Exception as e:
        logger.error(f"Erro ao criar custo: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar custo.")

@app.get("/readall/fornecedores/", response_model=List[schemas.Fornecedor])
def read_all_fornecedores(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    try:
        return crud.get_all_fornecedores(db, skip=skip, limit=limit)
    except Exception as e:
        logger.error(f"Erro ao listar todos os forncedores: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar fornecedores")

@app.get("/read/fornecedor/{fornecedor_id}", response_model=schemas.Fornecedor)
def read_fornecedor(fornecedor_id: int, db: Session = Depends(get_db)):
    try:
        return crud.get_fornecedor_by_id(db, fornecedor_id)
    except Exception as e:
        logger.error(f"Erro ao listar o fornecedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar o fornecedor")

@app.post("/create/fornecedor/", response_model=schemas.Fornecedor)
def create_fornecedor(fornecedor: schemas.FornecedorCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_fornecedor(db, fornecedor)
    except Exception as e:
        logger.error(f"Erro ao criar o fornecedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar o fornecedor")

@app.put("/update/fornecedor/{fornecedor_id}", response_model=schemas.Fornecedor)
def update_fornecedor(fornecedor_id: int, fornecedor: schemas.FornecedorUpdate, db: Session = Depends(get_db)):
    try:
        return crud.update_fornecedor(db, fornecedor_id, fornecedor)
    except Exception as e:
        logger.error(f"Erro ao atualizar o fornecedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar o fornecedor")

@app.delete("/delete/fornecedor/{fornecedor_id}", response_model=schemas.Fornecedor)
def delete_fornecedor(fornecedor_id: int, db: Session = Depends(get_db)):
    try:
        return crud.delete_fornecedor(db, fornecedor_id)
    except Exception as e:
        logger.error(f"Erro ao deletar o fornecedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao deletar o fornecedor")

@app.get("/readall/vendedores/", response_model=List[schemas.Vendedor])
def read_all_vendedores(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    try:
        return crud.get_all_vendedores(db, skip=skip, limit=limit)
    except Exception as e:
        logger.error(f"Erro ao listar todos os vendedores: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar vendedores")

@app.get("/read/vendedor/{vendedor_id}", response_model=schemas.Vendedor)
def read_vendedor(vendedor_id: int, db: Session = Depends(get_db)):
    try:
        return crud.get_vendedor_by_id(db, vendedor_id)
    except Exception as e:
        logger.error(f"Erro ao listar o vendedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar o vendedor")

@app.post("/create/vendedor/", response_model=schemas.Vendedor)
def create_vendedor(vendedor: schemas.VendedorCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_vendedor(db, vendedor)
    except Exception as e:
        logger.error(f"Erro ao criar o vendedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar o vendedor")

@app.put("/update/vendedor/{vendedor_id}", response_model=schemas.Vendedor)
def update_vendedor(vendedor_id: int, vendedor: schemas.VendedorUpdate, db: Session = Depends(get_db)):
    try:
        return crud.update_vendedor(db, vendedor_id, vendedor)
    except Exception as e:
        logger.error(f"Erro ao atualizar o vendedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar o vendedor")

@app.delete("/delete/vendedor/{vendedor_id}", response_model=schemas.Vendedor)
def delete_vendedor(vendedor_id: int, db: Session = Depends(get_db)):
    try:
        return crud.delete_vendedor(db, vendedor_id)
    except Exception as e:
        logger.error(f"Erro ao deletar o vendedor: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao deletar o vendedor")

@app.get("/readall/produtos/", response_model=List[schemas.Produto])
def read_all_produtos(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    try:
        return crud.get_all_produtos(db, skip=skip, limit=limit)
    except Exception as e:
        logger.error(f"Erro ao listar todos os produtos: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar produtos")

@app.get("/read/produto/{produto_id}", response_model=schemas.Produto)
def read_produto(produto_id: int, db: Session = Depends(get_db)):
    try:
        return crud.get_produto_by_id(db, produto_id)
    except Exception as e:
        logger.error(f"Erro ao listar o produto: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar o produto")

@app.post("/create/produto/", response_model=schemas.Produto)
def create_produto(produto: schemas.ProdutoCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_produto(db, produto)
    except Exception as e:
        logger.error(f"Erro ao criar o produto: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar o produto")

@app.put("/update/produto/{produto_id}", response_model=schemas.Produto)
def update_produto(produto_id: int, produto: schemas.ProdutoUpdate, db: Session = Depends(get_db)):
    try:
        return crud.update_produto(db, produto_id, produto)
    except Exception as e:
        logger.error(f"Erro ao atualizar o produto: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar o produto")

@app.delete("/delete/produto/{produto_id}", response_model=schemas.Produto)
def delete_produto(produto_id: int, db: Session = Depends(get_db)):
    try:
        return crud.delete_produto(db, produto_id)
    except Exception as e:
        logger.error(f"Erro ao deletar o produto: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao deletar o ")

@app.get("/readall/vendas/", response_model=List[schemas.Venda])
def read_all_vendas(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    try:
        return crud.get_all_vendas(db, skip=skip, limit=limit)
    except Exception as e:
        logger.error(f"Erro ao listar todas as vendas: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar vendas")

@app.get("/read/venda/{venda_id}", response_model=schemas.Venda)
def read_venda(venda_id: int, db: Session = Depends(get_db)):
    try:
        return crud.get_venda_by_id(db, venda_id)
    except Exception as e:
        logger.error(f"Erro ao listar a venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao listar a venda")

@app.post("/create/venda/", response_model=schemas.Venda)
def create_venda(venda: schemas.VendaCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_venda(db, venda)
    except Exception as e:
        logger.error(f"Erro ao criar a venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar a venda")

@app.put("/update/venda/{venda_id}", response_model=schemas.Venda)
def update_venda(venda_id: int, venda: schemas.VendaUpdate, db: Session = Depends(get_db)):
    try:
        return crud.update_venda(db, venda_id, venda)
    except Exception as e:
        logger.error(f"Erro ao atualizar a venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar a venda")

@app.delete("/delete/venda/{venda_id}", response_model=schemas.Venda)
def delete_venda(venda_id: int, db: Session = Depends(get_db)):
    try:
        return crud.delete_venda(db, venda_id)
    except Exception as e:
        logger.error(f"Erro ao deletar a venda: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao deletar a venda")
