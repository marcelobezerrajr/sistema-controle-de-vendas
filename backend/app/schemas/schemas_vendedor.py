from pydantic import BaseModel
from typing import Optional

from app.database.models import models_vendas


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
