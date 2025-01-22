from pydantic import BaseModel
from typing import Optional


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
