import api from "./api";

export const getAllClientes = async () => {
  try {
    const response = await api.get("/cliente/list");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao obter clientes.");
  }
};

export const getClienteById = async (id_cliente) => {
  if (!id_cliente) {
    throw new Error("ID de cliente não definido.");
  }
  try {
    const response = await api.get(`/cliente/view/${id_cliente}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    throw error;
  }
};

export const createCliente = async (clienteData) => {
  try {
    const response = await api.post("/cliente/create", clienteData);
    return response.data;
  } catch (error) {
    throw new Error("Erro ao criar cliente.");
  }
};

export const updateCliente = async (id_cliente, clienteData) => {
  if (!id_cliente) {
    throw new Error("id_cliente não definido.");
  }
  try {
    const response = await api.put(
      `/cliente/update/${id_cliente}`,
      clienteData
    );
    return response.data;
  } catch (error) {
    throw new Error("Erro ao atualizar cliente.");
  }
};

export const deleteCliente = async (id_cliente) => {
  if (!id_cliente) {
    throw new Error("id_cliente não definido.");
  }
  try {
    await api.delete(`/cliente/delete/${id_cliente}`);
  } catch (error) {
    throw new Error("Erro ao deletar cliente.");
  }
};
