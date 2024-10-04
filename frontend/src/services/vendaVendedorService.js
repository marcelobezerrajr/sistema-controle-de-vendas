import api from './api';

export const getAllVendaVendedor = async (skip = 0, limit = 10) => {
  try {
    const response = await api.get('/venda-vendedor/list');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter venda-vendedor.');
  }
};

export const getVendasByVendedor = async (id) => {
  try {
    const response = await api.get(`/venda-vendedor/vendedor/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter venda-vendedor.');
  }
};

export const createVendaVendedor = async (clienteData) => {
  try {
    const response = await api.post('/venda-vendedor/create', clienteData);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar venda-vendedor.');
  }
};
