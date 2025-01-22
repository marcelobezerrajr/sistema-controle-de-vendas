from pydantic import BaseModel


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
