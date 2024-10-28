import api from './api';

export const getAllItemVenda = async () => {
  try {
    const response = await api.get('/item-venda/list');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter Item Venda.');
  }
};

export const getItemVendaById = async (id_item_venda) => {
  if (!id_item_venda) {
    throw new Error('ID de item venda não definido.');
  }
  try {
    const response = await api.get(`/item-venda/view/${id_item_venda}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar itemvenda:', error);
    throw error;
  }
};

export const createItemVenda = async (itemvendaData) => {
  try {
    const response = await api.post('/item-venda/create', itemvendaData);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar Item Venda.');
  }
};
