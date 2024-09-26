from pydantic import BaseModel, validator
from typing import List, Optional
from datetime import date
from . import models

class ClienteBase(BaseModel):
    nome_cliente: str
    cpf_cnpj: str

    @validator("cpf_cnpj")
    def validate_cpf_cnpj(cls, v):
        if v and len(v) < 11:
            raise ValueError("CPF/CNPJ inválido.")
        return v

class ClienteCreate(ClienteBase):
    pass

class ClienteUpdate(BaseModel):
    nome_cliente: Optional[str] = None
    cpf_cnpj: Optional[str] = None

    @validator("cpf_cnpj")
    def validate_cpf_cnpj(cls, v):
        if v and len(v) < 11:
            raise ValueError("CPF/CNPJ inválido.")
        return v

class Cliente(ClienteBase):
    id_cliente: int

    class Config:
        from_attributes = True

class FornecedorBase(BaseModel):
    nome_fornecedor: str
    percentual_comissao: float
    impostos: float

class FornecedorCreate(FornecedorBase):
    pass

class FornecedorUpdate(BaseModel):
    nome_fornecedor: Optional[str] = None
    percentual_comissao: Optional[float] = None
    impostos: Optional[float] = None

class Fornecedor(FornecedorBase):
    id_fornecedor: int

    class Config:
        from_attributes = True

class VendedorBase(BaseModel):
    nome_vendedor: str
    tipo: models.VendedorEnum
    percentual_comissao: float

class VendedorCreate(VendedorBase):
    pass

class VendedorUpdate(BaseModel):
    nome_vendedor: Optional[str] = None
    tipo: Optional[models.VendedorEnum] = None
    percentual_comissao: Optional[float] = None

class Vendedor(VendedorBase):
    id_vendedor: int

    class Config:
        from_attributes = True

class ProdutoBase(BaseModel):
    nome_produto: str
    descricao_produto: Optional[str] = None
    preco: float
    tipo: models.ProdutoEnum

class ProdutoCreate(ProdutoBase):
    pass

class ProdutoUpdate(BaseModel):
    nome_produto: Optional[str] = None
    descricao_produto: Optional[str] = None
    preco: Optional[float] = None
    tipo: Optional[models.ProdutoEnum] = None

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
    tipo_venda: models.VendaEnum
    tipo_faturamento: models.FaturamentoEnum
    valor_total: float
    moeda: models.MoedaEnum
    valor_convertido: float
    id_cliente: int
    id_fornecedor: int

class VendaCreate(VendaBase):
    pass

class VendaUpdate(BaseModel):
    tipo_venda: Optional[models.VendaEnum] = None
    tipo_faturamento: Optional[models.FaturamentoEnum] = None
    valor_total: Optional[float] = None
    valor_convertido: Optional[float] = None
    moeda: Optional[models.MoedaEnum] = None
    id_cliente: Optional[int] = None
    id_fornecedor: Optional[int] = None

class Venda(VendaBase):
    id_venda: int
    itens_venda: List[ItemVenda] = []

    class Config:
        from_attributes = True

class ParcelaBase(BaseModel):
    id_venda: int
    numero_parcela: int
    valor_parcela: float
    data_prevista: str
    data_recebimento: Optional[str] = None
    status: models.StatusParcelaEnum
    forma_recebimento: Optional[models.FormaRecebimentoEnum] = None

    @validator('data_prevista', pre=True, always=True)
    def validate_data_prevista(cls, v):
        if isinstance(v, date):
            return v.strftime('%d/%m/%Y')
        return v

    @validator('data_recebimento', pre=True, always=True)
    def validate_data_recebimento(cls, v):
        if isinstance(v, date):
            return v.strftime('%d/%m/%Y')
        return v

    class Config:
        from_attributes = True

class ParcelaCreate(ParcelaBase):
    pass

class ParcelaUpdate(BaseModel):
    data_recebimento: Optional[str] = None
    status: Optional[models.StatusParcelaEnum] = None

class Parcela(ParcelaBase):
    id_parcela: int

    class Config:
        from_attributes = True

class ComissaoBase(BaseModel):
    id_vendedor: int
    id_parcela: int
    valor_comissao: float
    percentual_comissao: float
    data_pagamento: Optional[str] = None

class ComissaoCreate(ComissaoBase):
    pass

class Comissao(ComissaoBase):
    id_comissao: int

    class Config:
        from_attributes = True

class CustoBase(BaseModel):
    descricao: str
    valor: float
    id_venda: int

class CustoCreate(CustoBase):
    pass

class Custo(CustoBase):
    id_custo: int

    class Config:
        from_attributes = True
