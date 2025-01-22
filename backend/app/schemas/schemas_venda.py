from pydantic import BaseModel
from typing import List, Optional

from app.database.models import models_vendas
from app.schemas.schemas_item_venda import ItemVenda


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
