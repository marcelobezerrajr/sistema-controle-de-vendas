from pydantic import BaseModel

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
