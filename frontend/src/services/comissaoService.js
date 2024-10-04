import api from './api';

export const getAllComissoes = async () => {
  try {
    const response = await api.get('/comissao/list');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar comissões.');
  }
};

export const createComissao = async (comissaoData) => {
  try {
    const response = await api.post('/comissao/create', comissaoData);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar comissão.');
  }
};
