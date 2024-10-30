import api from './api';

export const getAllVendaVendedor = async () => {
  try {
    const response = await api.get('/venda-vendedor/list');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter venda-vendedor.');
  }
};

export const getVendasByVendedor = async (id_vendedor) => {
  try {
    const response = await api.get(`/venda-vendedor/view/${id_vendedor}`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter vendas do vendedor.');
  }
};

export const getVendaVendedor = async (id_venda, id_vendedor) => {
  try {
    const response = await api.get(`/venda-vendedor/view/${id_venda}/${id_vendedor}`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter venda-vendedor.');
  }
};

export const createVendaVendedor = async (vendavendedorData) => {
  try {
    const response = await api.post('/venda-vendedor/create', vendavendedorData);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar venda-vendedor.');
  }
};
