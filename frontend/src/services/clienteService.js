import api from './api';

export const getAllClientes = async () => {
  try {
    const response = await api.get('/cliente/list');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter clientes.');
  }
};

export const getClienteById = async (id) => {
  try {
    const response = await api.get(`/cliente/view/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter cliente.');
  }
};

export const createCliente = async (clienteData) => {
  try {
    const response = await api.post('/cliente/create', clienteData);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar cliente.');
  }
};

export const updateCliente = async (id, clienteData) => {
  try {
    const response = await api.put(`/cliente/update/${id}`, clienteData);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao atualizar cliente.');
  }
};

export const deleteCliente = async (id) => {
  try {
    await api.delete(`/cliente/delete/${id}`);
  } catch (error) {
    throw new Error('Erro ao deletar cliente.');
  }
};
