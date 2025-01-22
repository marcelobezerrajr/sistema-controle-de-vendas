from pydantic import BaseModel, validator
from typing import Optional
from datetime import date


class ComissaoBase(BaseModel):
    id_vendedor: int
    id_parcela: int
    valor_comissao: float
    percentual_comissao: float
    data_pagamento: Optional[str] = None

    @validator("data_pagamento", pre=True, always=True)
    def validate_data_pagamento(cls, v):
        if isinstance(v, date):
            return v.strftime("%d/%m/%Y")
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
