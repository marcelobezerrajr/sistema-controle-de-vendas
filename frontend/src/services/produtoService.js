import api from './api';

export const getAllProdutos = async (skip = 0, limit = 10) => {
  try {
    const response = await api.get('/produto/list');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter produtos.');
  }
};

export const getProdutoById = async (id) => {
  try {
    const response = await api.get(`/produto/view/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter produto.');
  }
};

export const createProduto = async (produtoData) => {
  try {
    const response = await api.post('/produto/create', produtoData);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar produto.');
  }
};

export const updateProduto = async (id, produtoData) => {
  try {
    const response = await api.put(`/produto/update/${id}`, produtoData);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao atualizar produto.');
  }
};

export const deleteProduto = async (id) => {
  try {
    await api.delete(`/produto/delete/${id}`);
  } catch (error) {
    throw new Error('Erro ao deletar produto.');
  }
};
