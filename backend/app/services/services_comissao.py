from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import logging

from app.schemas.schemas_comissao import ComissaoCreate, CalculateComissao
from app.database.models import models_vendas
from app.utils.check_exists_database import check_exists_database

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_all_comissoes(db: Session):
    logger.info("Buscando todos as comissões.")
    comissoes = db.query(models_vendas.Comissao).all()
    if not comissoes:
        logger.warning("Nenhuma comissão encontrado.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Nenhum comissão encontrado"
        )
    return comissoes


def get_comissao_by_id(db: Session, id_comissao: int):
    return check_exists_database(
        db,
        models_vendas.Comissao,
        "id_comissao",
        id_comissao,
        "Comissão não encontrada",
    )


def create_comissao(db: Session, comissao: ComissaoCreate):
    logger.info("Criando comissão.")
    try:
        check_exists_database(
            db,
            models_vendas.Vendedor,
            "id_vendedor",
            comissao.id_vendedor,
            "Vendedor não encontrado",
        )
        check_exists_database(
            db,
            models_vendas.Parcela,
            "id_parcela",
            comissao.id_parcela,
            "Parcela não encontrada",
        )

        venda = (
            db.query(models_vendas.Venda)
            .join(models_vendas.Parcela)
            .filter(models_vendas.Parcela.id_parcela == comissao.id_parcela)
            .first()
        )
        if not venda:
            raise HTTPException(
                status_code=404, detail="Venda associada não encontrada"
            )

        custos_venda = (
            db.query(models_vendas.Custo)
            .filter(models_vendas.Custo.id_venda == venda.id_venda)
            .all()
        )
        custo_total = sum(custo.valor for custo in custos_venda)

        vendedor = (
            db.query(models_vendas.Vendedor)
            .filter(models_vendas.Vendedor.id_vendedor == comissao.id_vendedor)
            .first()
        )
        if vendedor.tipo == models_vendas.VendedorEnum.inside_sales:
            percentual_comissao = 7.5
        elif vendedor.tipo == models_vendas.VendedorEnum.account_executive:
            percentual_comissao = 5.0
        else:
            raise HTTPException(status_code=400, detail="Tipo de vendedor inválido")

        valor_recebido = venda.valor_total - custo_total
        if valor_recebido < 0:
            raise HTTPException(
                status_code=400, detail="Custo total excede o valor da venda"
            )

        valor_comissao = valor_recebido * (percentual_comissao / 100)

        data_pagamento = None
        if comissao.data_pagamento:
            data_pagamento = datetime.strptime(
                comissao.data_pagamento, "%Y/%m/%d"
            ).date()

        db_comissao = models_vendas.Comissao(
            id_vendedor=comissao.id_vendedor,
            id_parcela=comissao.id_parcela,
            valor_comissao=valor_comissao,
            percentual_comissao=percentual_comissao,
            data_pagamento=data_pagamento,
        )
        db.add(db_comissao)
        db.commit()
        db.refresh(db_comissao)
        logger.info("Comissão criada com sucesso.")
        return db_comissao

    except HTTPException as e:
        logger.error(f"Erro ao criar comissão (HTTP): {str(e)} - Comissão: {comissao}")
        raise
    except Exception as e:
        logger.critical(f"Erro inesperado ao criar comissão {comissao}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar o comissão.",
        )


def calcular_comissao(db: Session, id_vendedor: int, id_parcela: int):
    check_exists_database(
        db,
        models_vendas.Vendedor,
        "id_vendedor",
        id_vendedor,
        "Vendedor não encontrado",
    )
    check_exists_database(
        db, models_vendas.Parcela, "id_parcela", id_parcela, "Parcela não encontrada"
    )

    venda = (
        db.query(models_vendas.Venda)
        .join(models_vendas.Parcela)
        .filter(models_vendas.Parcela.id_parcela == id_parcela)
        .first()
    )
    if not venda:
        raise HTTPException(status_code=404, detail="Venda associada não encontrada")

    custos_venda = (
        db.query(models_vendas.Custo)
        .filter(models_vendas.Custo.id_venda == venda.id_venda)
        .all()
    )
    custo_total = sum(custo.valor for custo in custos_venda)

    vendedor = (
        db.query(models_vendas.Vendedor)
        .filter(models_vendas.Vendedor.id_vendedor == id_vendedor)
        .first()
    )
    if vendedor.tipo == models_vendas.VendedorEnum.inside_sales:
        percentual_comissao = 7.5
    elif vendedor.tipo == models_vendas.VendedorEnum.account_executive:
        percentual_comissao = 5.0
    else:
        raise HTTPException(status_code=400, detail="Tipo de vendedor inválido")

    valor_recebido = venda.valor_total - custo_total
    if valor_recebido < 0:
        raise HTTPException(
            status_code=400, detail="Custo total excede o valor da venda"
        )

    valor_comissao = valor_recebido * (percentual_comissao / 100)

    logger.info("Comissão calculada com sucesso.")
    return CalculateComissao(
        id_vendedor=id_vendedor,
        id_parcela=id_parcela,
        valor_comissao=valor_comissao,
        percentual_comissao=percentual_comissao,
    )
