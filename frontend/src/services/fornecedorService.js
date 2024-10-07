import api from './api';

export const getAllFornecedores = async () => {
  try {
    const response = await api.get('/fornecedor/list');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter fornecedores.');
  }
};

export const getFornecedorById = async (id) => {
  try {
    const response = await api.get(`/fornecedor/view/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter fornecedor.');
  }
};

export const createFornecedor = async (fornecedorData) => {
  try {
    const response = await api.post('/fornecedor/create', fornecedorData);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar fornecedor.');
  }
};

export const updateFornecedor = async (id, fornecedorData) => {
  try {
    const response = await api.put(`/fornecedor/update/${id}`, fornecedorData);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao atualizar fornecedor.');
  }
};

export const deleteFornecedor = async (id) => {
  try {
    await api.delete(`/fornecedor/delete/${id}`);
  } catch (error) {
    throw new Error('Erro ao deletar fornecedor.');
  }
};
