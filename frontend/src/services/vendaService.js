import api from './api';

export const getAllVendas = async (skip = 0, limit = 10) => {
  try {
    const response = await api.get('/venda/list');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter vendas.');
  }
};

export const getVendaById = async (id) => {
  try {
    const response = await api.get(`/venda/view/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter venda.');
  }
};

export const createVenda = async (vendaData) => {
  try {
    const response = await api.post('/venda/create', vendaData);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar venda.');
  }
};

export const updateVenda = async (id, vendaData) => {
  try {
    const response = await api.put(`/venda/update/${id}`, vendaData);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao atualizar venda.');
  }
};

export const deleteVenda = async (id) => {
  try {
    await api.delete(`/venda/delete/${id}`);
  } catch (error) {
    throw new Error('Erro ao deletar venda.');
  }
};
