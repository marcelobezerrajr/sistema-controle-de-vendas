import api from "./api";

export const getAllProdutos = async () => {
  try {
    const response = await api.get("/produto/list");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao obter produtos.");
  }
};

export const getProdutoById = async (id_produto) => {
  try {
    const response = await api.get(`/produto/view/${id_produto}`);
    return response.data;
  } catch (error) {
    throw new Error("Erro ao obter produto.");
  }
};

export const createProduto = async (produtoData) => {
  try {
    const response = await api.post("/produto/create", produtoData);
    return response.data;
  } catch (error) {
    throw new Error("Erro ao criar produto.");
  }
};

export const updateProduto = async (id_produto, produtoData) => {
  try {
    const response = await api.put(
      `/produto/update/${id_produto}`,
      produtoData
    );
    return response.data;
  } catch (error) {
    throw new Error("Erro ao atualizar produto.");
  }
};

export const deleteProduto = async (id_produto) => {
  try {
    await api.delete(`/produto/delete/${id_produto}`);
  } catch (error) {
    throw new Error("Erro ao deletar produto.");
  }
};
