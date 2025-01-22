from pydantic import BaseModel
from typing import Optional

from app.database.models import models_vendas


class ProdutoBase(BaseModel):
    nome_produto: str
    descricao_produto: Optional[str] = None
    preco: float
    tipo: models_vendas.ProdutoEnum


class ProdutoCreate(ProdutoBase):
    pass


class ProdutoUpdate(BaseModel):
    nome_produto: Optional[str] = None
    descricao_produto: Optional[str] = None
    preco: Optional[float] = None
    tipo: Optional[models_vendas.ProdutoEnum] = None


class Produto(ProdutoBase):
    id_produto: int

    class Config:
        from_attributes = True
