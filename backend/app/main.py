from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.database.database import Base, engine
from app.api.routes import cliente, comissao, custo, fornecedor, item_venda, parcela, produto, venda, vendedor, vendavendedor

app = FastAPI(docs_url="/docs", redoc_url="/redoc")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def configure_all(app: FastAPI):
    configure_routes(app)
    configure_db()

def configure_routes(app: FastAPI):
    app.include_router(cliente.cliente_router, tags=["Cliente"])
    app.include_router(comissao.comissao_router, tags=["Comissão"])
    app.include_router(custo.custo_router, tags=["Custo"])
    app.include_router(fornecedor.fornecedor_router, tags=["Fornecedor"])
    app.include_router(item_venda.item_venda_router, tags=["Item Venda"])
    app.include_router(parcela.parcela_router, tags=["Parcela"])
    app.include_router(produto.produto_router, tags=["Produto"])
    app.include_router(venda.venda_router, tags=["Venda"])
    app.include_router(vendedor.vendedor_router, tags=["Vendedor"])
    app.include_router(vendavendedor.venda_vendedor_router, tags=["Venda Vendedor"])

def configure_db():
    Base.metadata.create_all(bind=engine)

@app.exception_handler(Exception)
def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unexpected error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error", "details": str(exc), "request": request.url},
    )

configure_all(app)

@app.get("/")
def root():
    return {"message": "Go to /docs!"}
