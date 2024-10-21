import api from './api';

export const getAllParcelas = async () => {
  try {
    const response = await api.get('/parcela/list');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter parcelas.');
  }
};

export const getParcelaById = async (id_parcela) => {
  if (!id_parcela) {
    throw new Error('ID de parcela não definido.');
  }
  try {
    const response = await api.get(`/parcela/view/${id_parcela}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar parcela:', error);
    throw error;
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

export const updateParcela = async (id_parcela, parcelaData) => {
  try {
    const response = await api.put(`/parcela/update/${id_parcela}`, parcelaData);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao atualizar parcela.');
  }
};
