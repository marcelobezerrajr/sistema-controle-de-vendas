import api from './api';

export const getAllVendedores = async (skip = 0, limit = 10) => {
  try {
    const response = await api.get('/vendedor/list');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter vendedores.');
  }
};

export const getVendedorById = async (id) => {
  try {
    const response = await api.get(`/vendedor/view/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter vendedor.');
  }
};

export const createVendedor = async (vendedorData) => {
  try {
    const response = await api.post('/vendedor/create', vendedorData);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar vendedor.');
  }
};

export const updateVendedor = async (id, vendedorData) => {
  try {
    const response = await api.put(`/vendedor/update/${id}`, vendedorData);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao atualizar vendedor.');
  }
};

export const deleteVendedor = async (id) => {
  try {
    await api.delete(`/vendedor/delete/${id}`);
  } catch (error) {
    throw new Error('Erro ao deletar vendedor.');
  }
};
