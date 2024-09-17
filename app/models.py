from sqlalchemy import Column, Integer, String, Float, Enum, ForeignKey, Text, Date
from sqlalchemy.orm import relationship
from .database import Base

# Modelos das Tabelas

class Cliente(Base):
    __tablename__ = 'cliente'
    
    id_cliente = Column(Integer, primary_key=True, autoincrement=True)
    nome_cliente = Column(String(255), nullable=False)
    cpf_cnpj = Column(String(20), nullable=False, unique=True)
    
    vendas = relationship("Venda", back_populates="cliente")


class Fornecedor(Base):
    __tablename__ = 'fornecedor'
    
    id_fornecedor = Column(Integer, primary_key=True, autoincrement=True)
    nome_fornecedor = Column(String(255), nullable=False)
    percentual_comissao = Column(Float)
    impostos = Column(Float)
    
    vendas = relationship("Venda", back_populates="fornecedor")


class Produto(Base):
    __tablename__ = 'produto'
    
    id_produto = Column(Integer, primary_key=True, autoincrement=True)
    nome_produto = Column(String(255), nullable=False)
    descricao_produto = Column(Text)
    preco = Column(Float, nullable=False)
    tipo = Column(Enum('Produto', 'Serviço'), nullable=False)


class Venda(Base):
    __tablename__ = 'venda'
    
    id_venda = Column(Integer, primary_key=True, autoincrement=True)
    tipo_venda = Column(Enum('Transacional', 'Recorrente'), nullable=False)
    tipo_faturamento = Column(Enum('Empresa', 'Fornecedor'), nullable=False)
    valor_total = Column(Float, nullable=False)
    moeda = Column(Enum('BRL', 'USD'), nullable=False)
    valor_convertido = Column(Float)
    
    id_cliente = Column(Integer, ForeignKey('cliente.id_cliente'))
    id_fornecedor = Column(Integer, ForeignKey('fornecedor.id_fornecedor'))
    
    cliente = relationship("Cliente", back_populates="vendas")
    fornecedor = relationship("Fornecedor", back_populates="vendas")

    itens_venda = relationship("ItemVenda", back_populates="venda")


class ItemVenda(Base):
    __tablename__ = 'item_venda'
    
    id_item_venda = Column(Integer, primary_key=True, autoincrement=True)
    id_venda = Column(Integer, ForeignKey('venda.id_venda'))
    id_produto = Column(Integer, ForeignKey('produto.id_produto'))
    
    quantidade = Column(Integer, nullable=False)
    preco_unitario = Column(Float, nullable=False)
    subtotal = Column(Float)
    
    venda = relationship("Venda", back_populates="itens_venda")
    produto = relationship("Produto")
