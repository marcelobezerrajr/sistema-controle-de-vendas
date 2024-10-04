from fastapi import HTTPException, status, logger
from sqlalchemy.orm import Session
from datetime import datetime
import logging

from app.schemas import schemas
from app.database.models import models

logger = logging.getLogger(__name__)

def get_all_clientes(db: Session):
    return db.query(models.Cliente).all()

def get_cliente_by_id(db: Session, cliente_id: int):
    cliente = db.query(models.Cliente).filter(models.Cliente.id_cliente == cliente_id).first()
    if cliente is None:
        logger.error(f"Cliente não encontrado com o id: {cliente_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não existe")
    return cliente

def create_cliente(db: Session, cliente: schemas.ClienteCreate):
    try:
        if db.query(models.Cliente).filter(models.Cliente.nome_cliente == cliente.nome_cliente).first():
            logger.error(f"Tentativa de criar um cliente com o nome já existente: {cliente.nome_cliente}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cliente já registrado.")

        db_cliente = models.Cliente(nome_cliente=cliente.nome_cliente, cpf_cnpj=cliente.cpf_cnpj)
        db.add(db_cliente)
        db.commit()
        db.refresh(db_cliente)
        return db_cliente
    except Exception as e:
        logger.error(f"Erro ao criar o novo cliente {cliente.nome_cliente}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar o cliente.")

def update_cliente(db: Session, cliente_id: int, cliente: schemas.ClienteUpdate):
    clientes = get_cliente_by_id(db, cliente_id)

    clientes.nome_cliente = cliente.nome_cliente
    clientes.cpf_cnpj = cliente.cpf_cnpj

    db.commit()
    db.refresh(clientes)
    return clientes

def delete_cliente(db: Session, cliente_id: int):
    clientes = get_cliente_by_id(db, cliente_id)
    db.delete(clientes)
    db.commit()
    return clientes

def create_item_venda(db: Session, item_venda: schemas.ItemVendaCreate):
    try:
        db_item = models.ItemVenda(
            id_venda=item_venda.id_venda,
            id_produto=item_venda.id_produto,
            quantidade=item_venda.quantidade,
            preco_unitario=item_venda.preco_unitario,
            subtotal=item_venda.quantidade * item_venda.preco_unitario
        )
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item
    except Exception as e:
        logger.error(f"Erro ao adicionar item à venda: {str(e)}")
        raise

def get_all_itens_venda(db: Session):
    return db.query(models.ItemVenda).all()

def get_item_venda_by_id(db: Session, id_item_venda: int):
    fornecedor = db.query(models.ItemVenda).filter(models.ItemVenda.id_item_venda == id_item_venda).first()
    if not fornecedor:
        raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
    return fornecedor

def delete_item_venda(db: Session, id_item_venda: int):
    item_venda = get_item_venda_by_id(db, id_item_venda)
    db.delete(item_venda)
    db.commit()
    return item_venda

def create_parcela(db: Session, parcela: schemas.ParcelaCreate):
    try:
        data_prevista = datetime.strptime(parcela.data_prevista, '%Y/%m/%d').date()
        data_recebimento = None
        if parcela.data_recebimento:
            data_recebimento = datetime.strptime(parcela.data_recebimento, '%Y/%m/%d').date()

        db_parcela = models.Parcela(
            id_venda=parcela.id_venda,
            numero_parcela=parcela.numero_parcela,
            valor_parcela=parcela.valor_parcela,
            data_prevista=data_prevista,
            data_recebimento=data_recebimento,
            status=parcela.status,
            forma_recebimento=parcela.forma_recebimento
        )
        
        db.add(db_parcela)
        db.commit()
        db.refresh(db_parcela)
        return db_parcela
    except Exception as e:
        logger.error(f"Erro ao criar parcela: {str(e)}")
        raise

def update_parcela(db: Session, parcela_id: int, parcela: schemas.ParcelaUpdate):
    db_parcela = db.query(models.Parcela).filter(models.Parcela.id_parcela == parcela_id).first()
    if not db_parcela:
        raise HTTPException(status_code=404, detail="Parcela não encontrada.")
    
    if parcela.data_recebimento:
        db_parcela.data_recebimento = datetime.strptime(parcela.data_recebimento, '%Y/%m/%d').date()
    
    if parcela.status:
        db_parcela.status = parcela.status

    db.commit()
    db.refresh(db_parcela)
    return db_parcela

def get_all_parcelas(db: Session):
    return db.query(models.Parcela).all()

def create_comissao(db: Session, comissao: schemas.ComissaoCreate):
    try:
        venda = db.query(models.Venda).join(models.Parcela).filter(models.Parcela.id_parcela == comissao.id_parcela).first()
        if not venda:
            raise HTTPException(status_code=404, detail="Venda associada não encontrada")

        custos_venda = db.query(models.Custo).filter(models.Custo.id_venda == venda.id_venda).all()
        custo_total = sum(custo.valor for custo in custos_venda)

        vendedor = db.query(models.Vendedor).filter(models.Vendedor.id_vendedor == comissao.id_vendedor).first()
        if vendedor.tipo == models.VendedorEnum.inside_sales:
            percentual_comissao = 7.5
        elif vendedor.tipo == models.VendedorEnum.account_executive:
            percentual_comissao = 5.0
        else:
            raise HTTPException(status_code=400, detail="Tipo de vendedor inválido")

        valor_recebido = venda.valor_total - custo_total
        valor_comissao = valor_recebido * (percentual_comissao / 100)

        data_pagamento = None
        if comissao.data_pagamento:
            data_pagamento = datetime.strptime(comissao.data_pagamento, '%Y/%m/%d').date()

        db_comissao = models.Comissao(
            id_vendedor=comissao.id_vendedor,
            id_parcela=comissao.id_parcela,
            valor_comissao=valor_comissao,
            percentual_comissao=percentual_comissao,
            data_pagamento=data_pagamento
        )
        db.add(db_comissao)
        db.commit()
        db.refresh(db_comissao)
        return db_comissao

    except Exception as e:
        logger.error(f"Erro ao criar comissão: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar comissão.")

def get_all_comissoes(db: Session):
    return db.query(models.Comissao).all()

def create_custo(db: Session, custo: schemas.CustoCreate):
    try:
        db_custo = models.Custo(
            descricao=custo.descricao,
            valor=custo.valor,
            id_venda=custo.id_venda
        )
        db.add(db_custo)
        db.commit()
        db.refresh(db_custo)
        return db_custo
    except Exception as e:
        logger.error(f"Erro ao criar custo: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao criar custo.")
    
def get_all_custos(db: Session):
    return db.query(models.Custo).all()
    
def get_all_fornecedores(db: Session):
    return db.query(models.Fornecedor).all()

def get_fornecedor_by_id(db: Session, fornecedor_id: int):
    fornecedor = db.query(models.Fornecedor).filter(models.Fornecedor.id_fornecedor == fornecedor_id).first()
    if not fornecedor:
        raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
    return fornecedor

def create_fornecedor(db: Session, fornecedor: schemas.FornecedorCreate):
    db_fornecedor = models.Fornecedor(
        nome_fornecedor=fornecedor.nome_fornecedor,
        percentual_comissao=fornecedor.percentual_comissao,
        impostos=fornecedor.impostos
    )
    db.add(db_fornecedor)
    db.commit()
    db.refresh(db_fornecedor)
    return db_fornecedor

def update_fornecedor(db: Session, fornecedor_id: int, fornecedor: schemas.FornecedorUpdate):
    db_fornecedor = get_fornecedor_by_id(db, fornecedor_id)
    db_fornecedor.nome_fornecedor = fornecedor.nome_fornecedor
    db_fornecedor.percentual_comissao = fornecedor.percentual_comissao
    db_fornecedor.impostos = fornecedor.impostos
    db.commit()
    db.refresh(db_fornecedor)
    return db_fornecedor

def delete_fornecedor(db: Session, fornecedor_id: int):
    fornecedor = get_fornecedor_by_id(db, fornecedor_id)
    db.delete(fornecedor)
    db.commit()
    return fornecedor

def get_all_vendedores(db: Session):
    return db.query(models.Vendedor).all()

def get_vendedor_by_id(db: Session, vendedor_id: int):
    vendedor = db.query(models.Vendedor).filter(models.Vendedor.id_vendedor == vendedor_id).first()
    if not vendedor:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")
    return vendedor

def create_vendedor(db: Session, vendedor: schemas.VendedorCreate):
    if vendedor.tipo == models.VendedorEnum.inside_sales:
        percentual_comissao = 7.5
    elif vendedor.tipo == models.VendedorEnum.account_executive:
        percentual_comissao = 5.0
    else:
        raise ValueError(f"Tipo de vendedor inválido: {vendedor.tipo}")
    
    db_vendedor = models.Vendedor(
        nome_vendedor=vendedor.nome_vendedor,
        tipo=vendedor.tipo,
        percentual_comissao=percentual_comissao
    )
    
    db.add(db_vendedor)
    db.commit()
    db.refresh(db_vendedor)
    return db_vendedor

def update_vendedor(db: Session, vendedor_id: int, vendedor: schemas.VendedorUpdate):
    db_vendedor = get_vendedor_by_id(db, vendedor_id)
    db_vendedor.nome_vendedor = vendedor.nome_vendedor
    db_vendedor.tipo = vendedor.tipo

    if vendedor.tipo == models.VendedorEnum.inside_sales:
        db_vendedor.percentual_comissao = 7.5
    elif vendedor.tipo == models.VendedorEnum.account_executive:
        db_vendedor.percentual_comissao = 5.0
    else:
        raise ValueError(f"Tipo de vendedor inválido: {vendedor.tipo}")
    
    db.commit()
    db.refresh(db_vendedor)
    return db_vendedor

def delete_vendedor(db: Session, vendedor_id: int):
    vendedor = get_vendedor_by_id(db, vendedor_id)
    db.delete(vendedor)
    db.commit()
    return vendedor

def get_all_produtos(db: Session):
    return db.query(models.Produto).all()

def get_produto_by_id(db: Session, produto_id: int):
    produto = db.query(models.Produto).filter(models.Produto.id_produto == produto_id).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto

def create_produto(db: Session, produto: schemas.ProdutoCreate):
    db_produto = models.Produto(
        nome_produto=produto.nome_produto,
        descricao_produto=produto.descricao_produto,
        preco=produto.preco,
        tipo=produto.tipo
    )
    db.add(db_produto)
    db.commit()
    db.refresh(db_produto)
    return db_produto

def update_produto(db: Session, produto_id: int, produto: schemas.ProdutoUpdate):
    db_produto = get_produto_by_id(db, produto_id)
    db_produto.nome_produto = produto.nome_produto
    db_produto.descricao_produto = produto.descricao_produto
    db_produto.preco = produto.preco
    db_produto.tipo = produto.tipo
    db.commit()
    db.refresh(db_produto)
    return db_produto

def delete_produto(db: Session, produto_id: int):
    produto = get_produto_by_id(db, produto_id)
    db.delete(produto)
    db.commit()
    return produto

def get_all_vendas(db: Session):
    return db.query(models.Venda).all()

def get_venda_by_id(db: Session, venda_id: int):
    venda = db.query(models.Venda).filter(models.Venda.id_venda == venda_id).first()
    if not venda:
        raise HTTPException(status_code=404, detail="Venda não encontrada")
    return venda

def create_venda(db: Session, venda: schemas.VendaCreate):
    db_venda = models.Venda(
        tipo_venda=venda.tipo_venda,
        tipo_faturamento=venda.tipo_faturamento,
        valor_total=venda.valor_total,
        moeda=venda.moeda,
        valor_convertido=venda.valor_convertido,
        id_cliente=venda.id_cliente,
        id_fornecedor=venda.id_fornecedor
    )
    db.add(db_venda)
    db.commit()
    db.refresh(db_venda)
    return db_venda

def update_venda(db: Session, venda_id: int, venda: schemas.VendaUpdate):
    db_venda = get_venda_by_id(db, venda_id)
    db_venda.tipo_venda = venda.tipo_venda
    db_venda.tipo_faturamento = venda.tipo_faturamento
    db_venda.valor_total = venda.valor_total
    db_venda.moeda = venda.moeda
    db_venda.valor_convertido = venda.valor_convertido
    db.commit()
    db.refresh(db_venda)
    return db_venda

def delete_venda(db: Session, venda_id: int):
    venda = get_venda_by_id(db, venda_id)
    db.delete(venda)
    db.commit()
    return venda

def create_venda_vendedor(db: Session, venda_vendedor: schemas.VendaVendedorCreate):
    if venda_vendedor.tipo_participacao == models.TipoParticipacaoEnum.inside_sales:
        percentual_comissao = 7.5
    elif venda_vendedor.tipo_participacao == models.TipoParticipacaoEnum.account_executive:
        percentual_comissao = 5.0
    else:
        raise ValueError(f"Tipo de vendedor inválido: {venda_vendedor.tipo_participacao}")
    
    db_venda_vendedor = models.VendaVendedor(
        tipo_participacao=venda_vendedor.tipo_participacao,
        percentual_comissao=percentual_comissao,
        id_venda=venda_vendedor.id_venda,
        id_vendedor=venda_vendedor.id_vendedor
    )
    
    db.add(db_venda_vendedor)
    db.commit()
    db.refresh(db_venda_vendedor)
    return db_venda_vendedor

def get_all_vendas_vendedor(db: Session):
    return db.query(models.VendaVendedor).all()

def get_vendas_by_vendedor(db: Session, id_vendedor: int):
    return db.query(models.VendaVendedor).filter(models.VendaVendedor.id_vendedor == id_vendedor).all()

def delete_venda_vendedor(db: Session, id_venda: int, id_vendedor: int):
    venda_vendedor = db.query(models.VendaVendedor).filter(
        models.VendaVendedor.id_venda == id_venda,
        models.VendaVendedor.id_vendedor == id_vendedor
    ).first()
    if venda_vendedor:
        db.delete(venda_vendedor)
        db.commit()
    return venda_vendedor
