from pydantic import BaseModel, validator
from typing import Optional
from datetime import date

from app.database.models import models_vendas


class ParcelaBase(BaseModel):
    id_venda: int
    numero_parcela: int
    valor_parcela: float
    data_prevista: str
    data_recebimento: Optional[str] = None
    status: models_vendas.StatusParcelaEnum
    forma_recebimento: Optional[models_vendas.FormaRecebimentoEnum] = None

    @validator("data_prevista", pre=True, always=True)
    def validate_data_prevista(cls, v):
        if isinstance(v, date):
            return v.strftime("%d/%m/%Y")
        return v

    @validator("data_recebimento", pre=True, always=True)
    def validate_data_recebimento(cls, v):
        if isinstance(v, date):
            return v.strftime("%d/%m/%Y")
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

    @validator("data_prevista", pre=True, always=True)
    def validate_data_prevista(cls, v):
        if isinstance(v, date):
            return v.strftime("%d/%m/%Y")
        return v

    @validator("data_recebimento", pre=True, always=True)
    def validate_data_recebimento(cls, v):
        if isinstance(v, date):
            return v.strftime("%d/%m/%Y")
        return v


class Parcela(ParcelaBase):
    id_parcela: int

    class Config:
        from_attributes = True
