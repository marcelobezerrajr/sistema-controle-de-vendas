from sqlalchemy import Column, Integer, String, Float, Enum, ForeignKey, Text, Date
from sqlalchemy.orm import relationship
from .database import Base

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

class Vendedor(Base):
    __tablename__ = 'vendedor'
    
    id_vendedor = Column(Integer, primary_key=True, autoincrement=True)
    nome_vendedor = Column(String(255), nullable=False)
    tipo = Column(Enum('Inside Sales', 'Account Executive'), nullable=False)
    percentual_comissao = Column(Float, nullable=False)
    
    comissoes = relationship("Comissao", back_populates="vendedor")
    vendas = relationship("VendaVendedor", back_populates="vendedor")

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
    
    parcelas = relationship("Parcela", back_populates="venda")
    itens_venda = relationship("ItemVenda", back_populates="venda")
    vendedores = relationship("VendaVendedor", back_populates="venda")

class ItemVenda(Base):
    __tablename__ = 'item_venda'
    
    id_item_venda = Column(Integer, primary_key=True, autoincrement=True)
    id_venda = Column(Integer, ForeignKey('venda.id_venda'))
    id_produto = Column(Integer, ForeignKey('produto.id_produto'))
    
    quantidade = Column(Integer, nullable=False)
    preco_unitario = Column(Float, nullable=False)
    subtotal = Column(Float)  # Removendo Computed e ajustando para Float
    
    venda = relationship("Venda", back_populates="itens_venda")
    produto = relationship("Produto")

class Parcela(Base):
    __tablename__ = 'parcela'
    
    id_parcela = Column(Integer, primary_key=True, autoincrement=True)
    id_venda = Column(Integer, ForeignKey('venda.id_venda'))
    
    numero_parcela = Column(Integer, nullable=False)
    valor_parcela = Column(Float, nullable=False)
    data_prevista = Column(Date, nullable=False)
    data_recebimento = Column(Date)
    status = Column(Enum('Pendente', 'Pago', 'Atrasado'), nullable=False)
    forma_recebimento = Column(Enum('Primeira', 'Subsequente'))
    
    venda = relationship("Venda", back_populates="parcelas")
    comissoes = relationship("Comissao", back_populates="parcela")

class Comissao(Base):
    __tablename__ = 'comissao'
    
    id_comissao = Column(Integer, primary_key=True, autoincrement=True)
    id_vendedor = Column(Integer, ForeignKey('vendedor.id_vendedor'))
    id_parcela = Column(Integer, ForeignKey('parcela.id_parcela'))
    
    valor_comissao = Column(Float, nullable=False)
    data_pagamento = Column(Date)
    percentual_comissao = Column(Float, nullable=False)
    
    vendedor = relationship("Vendedor", back_populates="comissoes")
    parcela = relationship("Parcela", back_populates="comissoes")

class VendaVendedor(Base):
    __tablename__ = 'venda_vendedor'
    
    id_venda = Column(Integer, ForeignKey('venda.id_venda'), primary_key=True)
    id_vendedor = Column(Integer, ForeignKey('vendedor.id_vendedor'), primary_key=True)
    
    tipo_participacao = Column(Enum('Inside Sales', 'Account Executive'), nullable=False)
    percentual_comissao = Column(Float, nullable=False)
    
    venda = relationship("Venda", back_populates="vendedores")
    vendedor = relationship("Vendedor", back_populates="vendas")

class Custo(Base):
    __tablename__ = 'custo'
    
    id_custo = Column(Integer, primary_key=True, autoincrement=True)
    descricao = Column(String(255), nullable=False)
    valor = Column(Float, nullable=False)
    id_venda = Column(Integer, ForeignKey('venda.id_venda'))
    
    venda = relationship("Venda")
