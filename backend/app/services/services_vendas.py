from fastapi import HTTPException, status, logger
from sqlalchemy.orm import Session
from datetime import datetime
import logging

from app.schemas import schemas_vendas
from app.database.models import models_vendas

logger = logging.getLogger(__name__)

def get_all_clientes(db: Session):
    return db.query(models_vendas.Cliente).all()

def get_cliente_by_id(db: Session, id_cliente: int):
    cliente = db.query(models_vendas.Cliente).filter(models_vendas.Cliente.id_cliente == id_cliente).first()
    if cliente is None:
        logger.error(f"Cliente não encontrado com o id: {id_cliente}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não existe")
    return cliente

def create_cliente(db: Session, cliente: schemas_vendas.ClienteCreate):
    try:
        if db.query(models_vendas.Cliente).filter(models_vendas.Cliente.nome_cliente == cliente.nome_cliente).first():
            logger.error(f"Tentativa de criar um cliente com o nome já existente: {cliente.nome_cliente}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cliente já registrado.")

        db_cliente = models_vendas.Cliente(nome_cliente=cliente.nome_cliente, cpf_cnpj=cliente.cpf_cnpj)
        db.add(db_cliente)
        db.commit()
        db.refresh(db_cliente)
        return db_cliente
    except Exception as e:
        logger.error(f"Erro ao criar o novo cliente {cliente.nome_cliente}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar o cliente.")

def update_cliente(db: Session, id_cliente: int, cliente: schemas_vendas.ClienteUpdate):
    clientes = get_cliente_by_id(db, id_cliente)

    clientes.nome_cliente = cliente.nome_cliente
    clientes.cpf_cnpj = cliente.cpf_cnpj

    db.commit()
    db.refresh(clientes)
    return clientes

def delete_cliente(db: Session, id_cliente: int):
    clientes = get_cliente_by_id(db, id_cliente)
    db.delete(clientes)
    db.commit()
    return clientes

def create_item_venda(db: Session, item_venda: schemas_vendas.ItemVendaCreate):
    try:
        db_item = models_vendas.ItemVenda(
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
    return db.query(models_vendas.ItemVenda).all()

def get_item_venda_by_id(db: Session, id_item_venda: int):
    fornecedor = db.query(models_vendas.ItemVenda).filter(models_vendas.ItemVenda.id_item_venda == id_item_venda).first()
    if not fornecedor:
        raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
    return fornecedor

def delete_item_venda(db: Session, id_item_venda: int):
    item_venda = get_item_venda_by_id(db, id_item_venda)
    db.delete(item_venda)
    db.commit()
    return item_venda

def create_parcela(db: Session, parcela: schemas_vendas.ParcelaCreate):
    try:
        data_prevista = datetime.strptime(parcela.data_prevista, '%Y/%m/%d').date()
        data_recebimento = None
        if parcela.data_recebimento:
            data_recebimento = datetime.strptime(parcela.data_recebimento, '%Y/%m/%d').date()

        db_parcela = models_vendas.Parcela(
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

def update_parcela(db: Session, id_parcela: int, parcela: schemas_vendas.ParcelaUpdate):
    db_parcela = db.query(models_vendas.Parcela).filter(models_vendas.Parcela.id_parcela == id_parcela).first()
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
    return db.query(models_vendas.Parcela).all()

def create_comissao(db: Session, comissao: schemas_vendas.ComissaoCreate):
    try:
        venda = db.query(models_vendas.Venda).join(models_vendas.Parcela).filter(models_vendas.Parcela.id_parcela == comissao.id_parcela).first()
        if not venda:
            raise HTTPException(status_code=404, detail="Venda associada não encontrada")

        custos_venda = db.query(models_vendas.Custo).filter(models_vendas.Custo.id_venda == venda.id_venda).all()
        custo_total = sum(custo.valor for custo in custos_venda)

        vendedor = db.query(models_vendas.Vendedor).filter(models_vendas.Vendedor.id_vendedor == comissao.id_vendedor).first()
        if vendedor.tipo == models_vendas.VendedorEnum.inside_sales:
            percentual_comissao = 7.5
        elif vendedor.tipo == models_vendas.VendedorEnum.account_executive:
            percentual_comissao = 5.0
        else:
            raise HTTPException(status_code=400, detail="Tipo de vendedor inválido")

        valor_recebido = venda.valor_total - custo_total
        valor_comissao = valor_recebido * (percentual_comissao / 100)

        data_pagamento = None
        if comissao.data_pagamento:
            data_pagamento = datetime.strptime(comissao.data_pagamento, '%Y/%m/%d').date()

        db_comissao = models_vendas.Comissao(
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
    return db.query(models_vendas.Comissao).all()

def create_custo(db: Session, custo: schemas_vendas.CustoCreate):
    try:
        db_custo = models_vendas.Custo(
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
    return db.query(models_vendas.Custo).all()
    
def get_all_fornecedores(db: Session):
    return db.query(models_vendas.Fornecedor).all()

def get_fornecedor_by_id(db: Session, id_fornecedor: int):
    fornecedor = db.query(models_vendas.Fornecedor).filter(models_vendas.Fornecedor.id_fornecedor == id_fornecedor).first()
    if not fornecedor:
        raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
    return fornecedor

def create_fornecedor(db: Session, fornecedor: schemas_vendas.FornecedorCreate):
    db_fornecedor = models_vendas.Fornecedor(
        nome_fornecedor=fornecedor.nome_fornecedor,
        percentual_comissao=fornecedor.percentual_comissao,
        impostos=fornecedor.impostos
    )
    db.add(db_fornecedor)
    db.commit()
    db.refresh(db_fornecedor)
    return db_fornecedor

def update_fornecedor(db: Session, id_fornecedor: int, fornecedor: schemas_vendas.FornecedorUpdate):
    db_fornecedor = get_fornecedor_by_id(db, id_fornecedor)
    db_fornecedor.nome_fornecedor = fornecedor.nome_fornecedor
    db_fornecedor.percentual_comissao = fornecedor.percentual_comissao
    db_fornecedor.impostos = fornecedor.impostos
    db.commit()
    db.refresh(db_fornecedor)
    return db_fornecedor

def delete_fornecedor(db: Session, id_fornecedor: int):
    fornecedor = get_fornecedor_by_id(db, id_fornecedor)
    db.delete(fornecedor)
    db.commit()
    return fornecedor

def get_all_vendedores(db: Session):
    return db.query(models_vendas.Vendedor).all()

def get_vendedor_by_id(db: Session, id_vendedor: int):
    vendedor = db.query(models_vendas.Vendedor).filter(models_vendas.Vendedor.id_vendedor == id_vendedor).first()
    if not vendedor:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")
    return vendedor

def create_vendedor(db: Session, vendedor: schemas_vendas.VendedorCreate):
    if vendedor.tipo == models_vendas.VendedorEnum.inside_sales:
        percentual_comissao = 7.5
    elif vendedor.tipo == models_vendas.VendedorEnum.account_executive:
        percentual_comissao = 5.0
    else:
        raise ValueError(f"Tipo de vendedor inválido: {vendedor.tipo}")
    
    db_vendedor = models_vendas.Vendedor(
        nome_vendedor=vendedor.nome_vendedor,
        tipo=vendedor.tipo,
        percentual_comissao=percentual_comissao
    )
    
    db.add(db_vendedor)
    db.commit()
    db.refresh(db_vendedor)
    return db_vendedor

def update_vendedor(db: Session, id_vendedor: int, vendedor: schemas_vendas.VendedorUpdate):
    db_vendedor = get_vendedor_by_id(db, id_vendedor)
    db_vendedor.nome_vendedor = vendedor.nome_vendedor
    db_vendedor.tipo = vendedor.tipo

    if vendedor.tipo == models_vendas.VendedorEnum.inside_sales:
        db_vendedor.percentual_comissao = 7.5
    elif vendedor.tipo == models_vendas.VendedorEnum.account_executive:
        db_vendedor.percentual_comissao = 5.0
    else:
        raise ValueError(f"Tipo de vendedor inválido: {vendedor.tipo}")
    
    db.commit()
    db.refresh(db_vendedor)
    return db_vendedor

def delete_vendedor(db: Session, id_vendedor: int):
    vendedor = get_vendedor_by_id(db, id_vendedor)
    db.delete(vendedor)
    db.commit()
    return vendedor

def get_all_produtos(db: Session):
    return db.query(models_vendas.Produto).all()

def get_produto_by_id(db: Session, id_produto: int):
    produto = db.query(models_vendas.Produto).filter(models_vendas.Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto

def create_produto(db: Session, produto: schemas_vendas.ProdutoCreate):
    db_produto = models_vendas.Produto(
        nome_produto=produto.nome_produto,
        descricao_produto=produto.descricao_produto,
        preco=produto.preco,
        tipo=produto.tipo
    )
    db.add(db_produto)
    db.commit()
    db.refresh(db_produto)
    return db_produto

def update_produto(db: Session, id_produto: int, produto: schemas_vendas.ProdutoUpdate):
    db_produto = get_produto_by_id(db, id_produto)
    db_produto.nome_produto = produto.nome_produto
    db_produto.descricao_produto = produto.descricao_produto
    db_produto.preco = produto.preco
    db_produto.tipo = produto.tipo
    db.commit()
    db.refresh(db_produto)
    return db_produto

def delete_produto(db: Session, id_produto: int):
    produto = get_produto_by_id(db, id_produto)
    db.delete(produto)
    db.commit()
    return produto

def get_all_vendas(db: Session):
    return db.query(models_vendas.Venda).all()

def get_venda_by_id(db: Session, id_venda: int):
    venda = db.query(models_vendas.Venda).filter(models_vendas.Venda.id_venda == id_venda).first()
    if not venda:
        raise HTTPException(status_code=404, detail="Venda não encontrada")
    return venda

def create_venda(db: Session, venda: schemas_vendas.VendaCreate):
    db_venda = models_vendas.Venda(
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

def update_venda(db: Session, id_venda: int, venda: schemas_vendas.VendaUpdate):
    db_venda = get_venda_by_id(db, id_venda)
    db_venda.tipo_venda = venda.tipo_venda
    db_venda.tipo_faturamento = venda.tipo_faturamento
    db_venda.valor_total = venda.valor_total
    db_venda.moeda = venda.moeda
    db_venda.valor_convertido = venda.valor_convertido
    db.commit()
    db.refresh(db_venda)
    return db_venda

def delete_venda(db: Session, id_venda: int):
    venda = get_venda_by_id(db, id_venda)
    db.delete(venda)
    db.commit()
    return venda

def create_venda_vendedor(db: Session, venda_vendedor: schemas_vendas.VendaVendedorCreate):
    if venda_vendedor.tipo_participacao == models_vendas.TipoParticipacaoEnum.inside_sales:
        percentual_comissao = 7.5
    elif venda_vendedor.tipo_participacao == models_vendas.TipoParticipacaoEnum.account_executive:
        percentual_comissao = 5.0
    else:
        raise ValueError(f"Tipo de vendedor inválido: {venda_vendedor.tipo_participacao}")
    
    db_venda_vendedor = models_vendas.VendaVendedor(
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
    return db.query(models_vendas.VendaVendedor).all()

def get_vendas_by_vendedor(db: Session, id_vendedor: int):
    return db.query(models_vendas.VendaVendedor).filter(models_vendas.VendaVendedor.id_vendedor == id_vendedor).all()

def delete_venda_vendedor(db: Session, id_venda: int, id_vendedor: int):
    venda_vendedor = db.query(models_vendas.VendaVendedor).filter(
        models_vendas.VendaVendedor.id_venda == id_venda,
        models_vendas.VendaVendedor.id_vendedor == id_vendedor
    ).first()
    if venda_vendedor:
        db.delete(venda_vendedor)
        db.commit()
    return venda_vendedor
