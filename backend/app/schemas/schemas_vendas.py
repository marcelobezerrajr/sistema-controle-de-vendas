from pydantic import BaseModel, validator
from typing import List, Optional
from datetime import date

from app.database.models import models_vendas

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
    tipo: models_vendas.VendedorEnum
    percentual_comissao: float

class VendedorCreate(VendedorBase):
    pass

class VendedorUpdate(BaseModel):
    nome_vendedor: Optional[str] = None
    tipo: Optional[models_vendas.VendedorEnum] = None
    percentual_comissao: Optional[float] = None

class Vendedor(VendedorBase):
    id_vendedor: int

    class Config:
        from_attributes = True

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

class ItemVendaBase(BaseModel):
    id_venda: int
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
    tipo_venda: models_vendas.VendaEnum
    tipo_faturamento: models_vendas.FaturamentoEnum
    valor_total: float
    moeda: models_vendas.MoedaEnum
    valor_convertido: float
    id_cliente: int
    id_fornecedor: int

class VendaCreate(VendaBase):
    pass

class VendaUpdate(BaseModel):
    tipo_venda: Optional[models_vendas.VendaEnum] = None
    tipo_faturamento: Optional[models_vendas.FaturamentoEnum] = None
    valor_total: Optional[float] = None
    valor_convertido: Optional[float] = None
    moeda: Optional[models_vendas.MoedaEnum] = None
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
    status: models_vendas.StatusParcelaEnum
    forma_recebimento: Optional[models_vendas.FormaRecebimentoEnum] = None

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
    id_venda: Optional[int] = None
    numero_parcela: Optional[int] = None
    valor_parcela: Optional[float] = None
    data_prevista: Optional[str] = None
    data_recebimento: Optional[str] = None
    status: Optional[models_vendas.StatusParcelaEnum] = None
    forma_recebimento: Optional[models_vendas.FormaRecebimentoEnum] = None

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

    @validator('data_pagamento', pre=True, always=True)
    def validate_data_pagamento(cls, v):
        if isinstance(v, date):
            return v.strftime('%d/%m/%Y')
        return v

    class Config:
        from_attributes = True

class ComissaoCreate(ComissaoBase):
    pass

class CalculateComissao(BaseModel):
    id_vendedor: int
    id_parcela: int
    valor_comissao: float
    percentual_comissao: float

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

class VendaVendedorBase(BaseModel):
    id_venda: int
    id_vendedor: int
    tipo_participacao: models_vendas.TipoParticipacaoEnum
    percentual_comissao: float

class VendaVendedorCreate(VendaVendedorBase):
    pass

class VendaVendedor(VendaVendedorBase):
    pass

    class Config:
        from_attributes = True
