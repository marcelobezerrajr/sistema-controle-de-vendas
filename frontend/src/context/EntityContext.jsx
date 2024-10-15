import React, { createContext, useContext, useState } from 'react';

const EntityContext = createContext();

export const EntityProvider = ({ children }) => {
  const [entityConfig, setEntityConfig] = useState({
    entityName: '',
    fetchUrl: '',
    fields: [],
  });

  const changeEntity = (entity) => {
    let config;

    switch (entity) {
      case 'cliente':
        config = {
          entityName: 'Cliente',
          fetchUrl: 'http://127.0.0.1:8000/cliente/view',
          fields: [
            { label: 'ID', key: 'id_cliente' },
            { label: 'Nome', key: 'nome_cliente' },
            { label: 'CPF/CNPJ', key: 'cpf_cnpj' },
          ],
        };
        break;

      case 'fornecedor':
        config = {
          entityName: 'Fornecedor',
          fetchUrl: 'http://127.0.0.1:8000/fornecedor/view',
          fields: [
            { label: 'ID', key: 'id_fornecedor' },
            { label: 'Nome', key: 'nome_fornecedor' },
            { label: 'Percentual de Comissão', key: 'percentual_comissao' },
            { label: 'Impostos', key: 'impostos' },
          ],
        };
        break;

        case 'vendedor':
        config = {
          entityName: 'Vendedor',
          fetchUrl: 'http://127.0.0.1:8000/vendedor/view',
          fields: [
            { label: 'ID', key: 'id_vendedor' },
            { label: 'Nome', key: 'nome_vendedor' },
            { label: 'Tipo', key: 'tipo' },
            { label: 'Percentual de Comissão', key: 'percentual_comissao' },
          ],
        };
        break;

        case 'produto':
        config = {
          entityName: 'Produto',
          fetchUrl: 'http://127.0.0.1:8000/produto/view',
          fields: [
            { label: 'ID', key: 'id_produto' },
            { label: 'Nome', key: 'nome_produto' },
            { label: 'Descrição', key: 'descricao_produto' },
            { label: 'Preço', key: 'preco' },
            { label: 'Tipo', key: 'tipo' },
          ],
        };
        break;

        case 'venda':
        config = {
          entityName: 'Venda',
          fetchUrl: 'http://127.0.0.1:8000/venda/view',
          fields: [
            { label: 'ID Venda', key: 'id_venda' },
            { label: 'Tipo Venda', key: 'tipo_venda' },
            { label: 'Tipo Faturamento', key: 'tipo_faturamento' },
            { label: 'Valor Total', key: 'valor_total' },
            { label: 'Moeda', key: 'moeda' },
            { label: 'Valor Convertido', key: 'valor_convertido' },
            { label: 'ID Cliente', key: 'id_cliente' },
            { label: 'ID Fornecedor', key: 'id_fornecedor' },
          ],
        };
        break;

        case 'comissao':
        config = {
          entityName: 'Comissao',
          fetchUrl: 'http://127.0.0.1:8000/comissao/view',
          fields: [
            { label: 'ID Comissão', key: 'id_comissao' },
            { label: 'Valor Comissão', key: 'valor_comissao' },
            { label: 'Data Pagamento', key: 'data_pagamento' },
            { label: 'Percentual Comissão', key: 'percentual_comissao' },
            { label: 'ID Vendedor', key: 'id_vendedor' },
            { label: 'ID Parcela', key: 'id_parcela' },
          ],
        };
        break;

        case 'custo':
        config = {
          entityName: 'Custo',
          fetchUrl: 'http://127.0.0.1:8000/custo/view',
          fields: [
            { label: 'ID Custo', key: 'id_custo' },
            { label: 'Descrição', key: 'descricao' },
            { label: 'Valor', key: 'valor' },
            { label: 'ID Venda', key: 'id_venda' },
          ],
        };
        break;

        case 'parcela':
        config = {
          entityName: 'Parcela',
          fetchUrl: 'http://127.0.0.1:8000/parcela/view',
          fields: [
            { label: 'ID Parcela', key: 'id_parcela' },
            { label: 'ID Venda', key: 'id_venda' },
            { label: 'Número Parcela', key: 'numero_parcela' },
            { label: 'Valor Parcela', key: 'valor_parcela' },
            { label: 'Data Prevista', key: 'data_prevista' },
            { label: 'Data Recebimento', key: 'data_recebimento' },
            { label: 'Status', key: 'status' },
            { label: 'Forma Recebimento', key: 'forma_recebimento' },
          ],
        };
        break;

        case 'user':
        config = {
          entityName: 'Usuario',
          fetchUrl: 'http://127.0.0.1:8000/user/view',
          fields: [
            { label: 'ID Usuário', key: 'id_user' },
            { label: 'Username', key: 'username' },
            { label: 'Email', key: 'email' },
            { label: 'Permissão', key: 'permission' },
          ],
        };
        break;

        case 'item-venda':
        config = {
          entityName: 'Item Venda',
          fetchUrl: 'http://127.0.0.1:8000/item-venda/view',
          fields: [
            { label: 'ID Item Venda', key: 'id_item_venda' },
            { label: 'ID Venda', key: 'id_venda' },
            { label: 'ID Produto', key: 'id_produto' },
            { label: 'Quantidade', key: 'quantidade' },
            { label: 'Preço Unitário', key: 'preco_unitario' },
            { label: 'Subtotal', key: 'subtotal' },
          ],
        };
        break;

      default:
        config = {
          entityName: '',
          fetchUrl: '',
          fields: [],
        };
    }

    setEntityConfig(config);
  };

  return (
    <EntityContext.Provider value={{ entityConfig, changeEntity }}>
      {children}
    </EntityContext.Provider>
  );
};

export const useEntityContext = () => useContext(EntityContext);
