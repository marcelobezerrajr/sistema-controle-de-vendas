from pydantic import BaseModel

from app.database.models import models_vendas


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
