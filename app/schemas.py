from pydantic import BaseModel
from typing import List, Optional

class ClienteBase(BaseModel):
    nome_cliente: str
    cpf_cnpj: str

class ClienteCreate(ClienteBase):
    pass

class ClienteUpdate(BaseModel):
    nome_cliente: Optional[str] = None
    cpf_cnpj: Optional[str] = None

class Cliente(ClienteBase):
    id_cliente: int
    nome_cliente: str

    class Config:
        from_attributes = True


class ProdutoBase(BaseModel):
    nome_produto: str
    descricao_produto: Optional[str] = None
    preco: float
    tipo: str

class ProdutoCreate(ProdutoBase):
    pass

class Produto(ProdutoBase):
    id_produto: int

    class Config:
        from_attributes = True


class ItemVendaBase(BaseModel):
    id_produto: int
    quantidade: int
    preco_unitario: float

class ItemVendaCreate(ItemVendaBase):
    pass

class ItemVenda(ItemVendaBase):
    id_item_venda: int
    subtotal: float

    class Config:
        from_attributes = True


class VendaBase(BaseModel):
    tipo_venda: str
    tipo_faturamento: str
    valor_total: float
    moeda: str
    id_cliente: int
    id_fornecedor: int

class VendaCreate(VendaBase):
    pass

class Venda(VendaBase):
    id_venda: int
    itens_venda: List[ItemVenda] = []

    class Config:
        from_attributes = True
