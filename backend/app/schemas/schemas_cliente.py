from pydantic import BaseModel, validator
from typing import Optional

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
