from fastapi import HTTPException, status, logger
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
import logging

from app.schemas import schemas_vendas
from app.database.models import models_vendas

logger = logging.getLogger(__name__)

def check_exists(db: Session, model, id_field: str, id_value: int, not_found_message: str):
    instance = db.query(model).filter(getattr(model, id_field) == id_value).first()
    if not instance:
        logger.error(f"{not_found_message} - ID {id_value}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=not_found_message)
    return instance

def get_all_clientes(db: Session):
    return db.query(models_vendas.Cliente).all()

def get_cliente_by_id(db: Session, id_cliente: int):
    return check_exists(db, models_vendas.Cliente, 'id_cliente', id_cliente, "Cliente não encontrado")

def create_cliente(db: Session, cliente: schemas_vendas.ClienteCreate):
    try:
        db_cliente = models_vendas.Cliente(nome_cliente=cliente.nome_cliente, cpf_cnpj=cliente.cpf_cnpj)
        db.add(db_cliente)
        db.commit()
        db.refresh(db_cliente)
        return db_cliente
    except HTTPException as e:
        logger.error(f"Erro ao criar cliente (HTTP): {str(e)} - Cliente: {cliente}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar cliente {cliente.nome_cliente}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar o cliente.")

def update_cliente(db: Session, id_cliente: int, cliente: schemas_vendas.ClienteUpdate):
    db_cliente = get_cliente_by_id(db, id_cliente)
    
    if cliente.nome_cliente:
        db_cliente.nome_cliente = cliente.nome_cliente
    if cliente.cpf_cnpj:
        db_cliente.cpf_cnpj = cliente.cpf_cnpj

    try:
        db.commit()
        db.refresh(db_cliente)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar o cliente no banco de dados"
        ) from e
    
    return db_cliente

def delete_cliente(db: Session, id_cliente: int):
    clientes = get_cliente_by_id(db, id_cliente)
    db.delete(clientes)
    db.commit()
    return clientes

def get_all_itens_venda(db: Session):
    return db.query(models_vendas.ItemVenda).all()

def get_item_venda_by_id(db: Session, id_item_venda: int):
    return check_exists(db, models_vendas.ItemVenda, 'id_item_venda', id_item_venda, "Item Venda não encontrado")

def create_item_venda(db: Session, item_venda: schemas_vendas.ItemVendaCreate):
    try:
        db_item_venda = models_vendas.ItemVenda(
            id_venda=item_venda.id_venda,
            id_produto=item_venda.id_produto,
            quantidade=item_venda.quantidade,
            preco_unitario=item_venda.preco_unitario,
            subtotal=item_venda.quantidade * item_venda.preco_unitario
        )
        db.add(db_item_venda)
        db.commit()
        db.refresh(db_item_venda)
        return db_item_venda
    except HTTPException as e:
        logger.error(f"Erro ao criar item venda (HTTP): {str(e)} - Item Venda: {item_venda}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar item venda {item_venda}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar o item venda.")

def delete_item_venda(db: Session, id_item_venda: int):
    item_venda = get_item_venda_by_id(db, id_item_venda)
    db.delete(item_venda)
    db.commit()
    return item_venda

def get_all_parcelas(db: Session):
    return db.query(models_vendas.Parcela).all()

def get_parcela_by_id(db: Session, id_parcela: int):
    return check_exists(db, models_vendas.Parcela, 'id_parcela', id_parcela, "Parcela não encontrada")
    
def create_parcela(db: Session, parcela: schemas_vendas.ParcelaCreate, venda: schemas_vendas.Venda):
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
    except HTTPException as e:
        logger.error(f"Erro ao criar parcela (HTTP): {str(e)} - Parcela: {parcela}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar parcela {parcela}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar a parcela.")

def update_parcela(db: Session, id_parcela: int, parcela: schemas_vendas.ParcelaUpdate, venda: schemas_vendas.Venda):
    db_parcela = get_parcela_by_id(db, id_parcela)
    
    if parcela.data_recebimento:
        db_parcela.data_recebimento = datetime.strptime(parcela.data_recebimento, '%Y/%m/%d').date()
    
    if parcela.status:
        db_parcela.status = parcela.status

    try:
        db.commit()
        db.refresh(db_parcela)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar a parcela no banco de dados"
        ) from e
    
    return db_parcela

def get_all_comissoes(db: Session):
    return db.query(models_vendas.Comissao).all()

def get_comissao_by_id(db: Session, id_comissao: int):
    return check_exists(db, models_vendas.Comissao, 'id_comissao', id_comissao, "Comissão não encontrada")

def create_comissao(db: Session, comissao: schemas_vendas.ComissaoCreate, vendedores: schemas_vendas.Vendedor, parcela: schemas_vendas.Parcela):
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

    except HTTPException as e:
        logger.error(f"Erro ao criar comissão (HTTP): {str(e)} - Comissão: {comissao}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar comissão {comissao}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar o comissão.")
    
def get_all_custos(db: Session):
    return db.query(models_vendas.Custo).all()

def get_custo_by_id(db: Session, id_custo: int):
    return check_exists(db, models_vendas.Custo, 'id_custo', id_custo, "Custo não encontrado")

def create_custo(db: Session, custo: schemas_vendas.CustoCreate, venda: schemas_vendas.Venda):
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
    except HTTPException as e:
        logger.error(f"Erro ao criar custo (HTTP): {str(e)} - Custo: {custo}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar custo {custo}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar o custo.")
    
def get_all_fornecedores(db: Session):
    return db.query(models_vendas.Fornecedor).all()

def get_fornecedor_by_id(db: Session, id_fornecedor: int):
    return check_exists(db, models_vendas.Fornecedor, 'id_fornecedor', id_fornecedor, "Fornecedor não encontrado")

def create_fornecedor(db: Session, fornecedor: schemas_vendas.FornecedorCreate):
    try:
        db_fornecedor = models_vendas.Fornecedor(
            nome_fornecedor=fornecedor.nome_fornecedor,
            percentual_comissao=fornecedor.percentual_comissao,
            impostos=fornecedor.impostos
        )
        db.add(db_fornecedor)
        db.commit()
        db.refresh(db_fornecedor)
        return db_fornecedor
    except HTTPException as e:
        logger.error(f"Erro ao criar fornecedor (HTTP): {str(e)} - Fornecedor: {fornecedor}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar fornecedor {fornecedor.nome_fornecedor}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar o fornecedor.")

def update_fornecedor(db: Session, id_fornecedor: int, fornecedor: schemas_vendas.FornecedorUpdate):
    db_fornecedor = get_fornecedor_by_id(db, id_fornecedor)

    if fornecedor.nome_fornecedor:
        db_fornecedor.nome_fornecedor = fornecedor.nome_fornecedor
    if fornecedor.percentual_comissao:
        db_fornecedor.percentual_comissao = fornecedor.percentual_comissao
    if fornecedor.impostos:
        db_fornecedor.impostos = fornecedor.impostos

    try:
        db.commit()
        db.refresh(db_fornecedor)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar o fornecedor no banco de dados"
        ) from e
    
    return db_fornecedor

def delete_fornecedor(db: Session, id_fornecedor: int):
    fornecedor = get_fornecedor_by_id(db, id_fornecedor)
    db.delete(fornecedor)
    db.commit()
    return fornecedor

def get_all_vendedores(db: Session):
    return db.query(models_vendas.Vendedor).all()

def get_vendedor_by_id(db: Session, id_vendedor: int):
    return check_exists(db, models_vendas.Vendedor, 'id_vendedor', id_vendedor, "Vendedor não encontrado")

def create_vendedor(db: Session, vendedor: schemas_vendas.VendedorCreate):
    try:
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
    except HTTPException as e:
        logger.error(f"Erro ao criar vendedor (HTTP): {str(e)} - Vendedor: {vendedor}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar vendedor {vendedor.nome_vendedor}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar o vendedor.")

def update_vendedor(db: Session, id_vendedor: int, vendedor: schemas_vendas.VendedorUpdate):
    db_vendedor = get_vendedor_by_id(db, id_vendedor)

    if vendedor.nome_vendedor:
        db_vendedor.nome_vendedor = vendedor.nome_vendedor
    if vendedor.tipo:
        db_vendedor.tipo = vendedor.tipo

    if vendedor.tipo == models_vendas.VendedorEnum.inside_sales:
        db_vendedor.percentual_comissao = 7.5
    elif vendedor.tipo == models_vendas.VendedorEnum.account_executive:
        db_vendedor.percentual_comissao = 5.0
    else:
        raise ValueError(f"Tipo de vendedor inválido: {vendedor.tipo}")
    
    try:
        db.commit()
        db.refresh(db_vendedor)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar o vendedor no banco de dados"
        ) from e

    return db_vendedor

def delete_vendedor(db: Session, id_vendedor: int):
    vendedor = get_vendedor_by_id(db, id_vendedor)
    db.delete(vendedor)
    db.commit()
    return vendedor

def get_all_produtos(db: Session):
    return db.query(models_vendas.Produto).all()

def get_produto_by_id(db: Session, id_produto: int):
    return check_exists(db, models_vendas.Produto, 'id_produto', id_produto, "Produto não encontrado")

def create_produto(db: Session, produto: schemas_vendas.ProdutoCreate):
    try:
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
    except HTTPException as e:
        logger.error(f"Erro ao criar produto (HTTP): {str(e)} - Produto: {produto}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar produto {produto.nome_produto}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar o produto.")

def update_produto(db: Session, id_produto: int, produto: schemas_vendas.ProdutoUpdate):
    db_produto = get_produto_by_id(db, id_produto)

    if produto.nome_produto:
        db_produto.nome_produto = produto.nome_produto
    if produto.descricao_produto:
        db_produto.descricao_produto = produto.descricao_produto
    if produto.preco:
        db_produto.preco = produto.preco
    if produto.tipo:
        db_produto.tipo = produto.tipo

    try:
        db.commit()
        db.refresh(db_produto)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar o produto no banco de dados"
        ) from e
    
    return db_produto

def delete_produto(db: Session, id_produto: int):
    produto = get_produto_by_id(db, id_produto)
    db.delete(produto)
    db.commit()
    return produto

def get_all_vendas(db: Session):
    return db.query(models_vendas.Venda).all()

def get_venda_by_id(db: Session, id_venda: int):
    return check_exists(db, models_vendas.Venda, 'id_venda', id_venda, "Venda não encontrada")

def create_venda(db: Session, venda: schemas_vendas.VendaCreate):
    try:
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
    except HTTPException as e:
        logger.error(f"Erro ao criar venda (HTTP): {str(e)} - Venda: {venda}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar venda {venda}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar o venda.")
    
def update_venda(db: Session, id_venda: int, venda: schemas_vendas.VendaUpdate, cliente: schemas_vendas.Cliente, fornecedor: schemas_vendas.Fornecedor):
    db_venda = get_venda_by_id(db, id_venda)

    if venda.tipo_venda:
        db_venda.tipo_venda = venda.tipo_venda
    if venda.tipo_faturamento:
        db_venda.tipo_faturamento = venda.tipo_faturamento
    if venda.valor_total:
        db_venda.valor_total = venda.valor_total
    if venda.moeda:
        db_venda.moeda = venda.moeda
    if venda.valor_convertido:
        db_venda.valor_convertido = venda.valor_convertido

    try:
        db.commit()
        db.refresh(db_venda)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar a venda no banco de dados"
        ) from e

    return db_venda

def delete_venda(db: Session, id_venda: int):
    venda = get_venda_by_id(db, id_venda)
    db.delete(venda)
    db.commit()
    return venda

def get_all_vendas_vendedor(db: Session):
    return db.query(models_vendas.VendaVendedor).all()

def get_vendas_by_vendedor(db: Session, id_vendedor: int):
    return db.query(models_vendas.VendaVendedor).filter(models_vendas.VendaVendedor.id_vendedor == id_vendedor).all()

def create_venda_vendedor(db: Session, venda_vendedor: schemas_vendas.VendaVendedorCreate, venda: schemas_vendas.Venda, vendedor: schemas_vendas.Vendedor):
    try:
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
    except HTTPException as e:
        logger.error(f"Erro ao criar venda vendedor (HTTP): {str(e)} - Venda Vendedor: {venda_vendedor}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar venda_vendedor {venda_vendedor}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao criar o venda vendedor.")

def delete_venda_vendedor(db: Session, id_venda: int, id_vendedor: int):
    venda_vendedor = db.query(models_vendas.VendaVendedor).filter(
        models_vendas.VendaVendedor.id_venda == id_venda,
        models_vendas.VendaVendedor.id_vendedor == id_vendedor
    ).first()
    if venda_vendedor:
        db.delete(venda_vendedor)
        db.commit()
    return venda_vendedor
