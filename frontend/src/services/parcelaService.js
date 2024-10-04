import api from './api';

export const getAllParcelas = async (skip = 0, limit = 10) => {
  try {
    const response = await api.get('/parcela/list');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter parcelas.');
  }
};

export const createParcela = async (parcelaData) => {
  try {
    const response = await api.post('/parcela/create', parcelaData);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar parcela.');
  }
};

export const updateParcela = async (id, parcelaData) => {
  try {
    const response = await api.put(`/parcela/update/${id}`, parcelaData);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao atualizar parcela.');
  }
};
