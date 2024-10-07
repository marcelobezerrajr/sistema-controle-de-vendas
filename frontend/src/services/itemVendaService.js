import api from './api';

export const getAllItemVenda = async () => {
  try {
    const response = await api.get('/itemvenda/list');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter Item Venda.');
  }
};

export const createItemVenda = async (itemvendaData) => {
  try {
    const response = await api.post('/itemvenda/create', itemvendaData);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar Item Venda.');
  }
};
