import api from "./api";

export const getAllVendedores = async () => {
  try {
    const response = await api.get("/vendedor/list");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao obter vendedores.");
  }
};

export const getVendedorById = async (id_vendedor) => {
  try {
    const response = await api.get(`/vendedor/view/${id_vendedor}`);
    return response.data;
  } catch (error) {
    throw new Error("Erro ao obter vendedor.");
  }
};

export const createVendedor = async (vendedorData) => {
  try {
    const response = await api.post("/vendedor/create", vendedorData);
    return response.data;
  } catch (error) {
    throw new Error("Erro ao criar vendedor.");
  }
};

export const updateVendedor = async (id_vendedor, vendedorData) => {
  try {
    const response = await api.put(
      `/vendedor/update/${id_vendedor}`,
      vendedorData
    );
    return response.data;
  } catch (error) {
    throw new Error("Erro ao atualizar vendedor.");
  }
};

export const deleteVendedor = async (id_vendedor) => {
  try {
    await api.delete(`/vendedor/delete/${id_vendedor}`);
  } catch (error) {
    throw new Error("Erro ao deletar vendedor.");
  }
};
