import React, { createContext, useState, useEffect, useContext } from "react";
import {
  getAllProdutos,
  getProdutoById,
  createProduto,
  updateProduto,
  deleteProduto,
} from "../services/produtoService";
import { LoginContext } from "./LoginContext";

export const ProdutoContext = createContext();

export const ProdutoProvider = ({ children }) => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(LoginContext);

  useEffect(() => {
    const fetchProdutos = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const data = await getAllProdutos();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao carregar Produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [user]);

  const getProduto = async (id_produto) => {
    try {
      const produto = await getProdutoById(id_produto);
      if (!produto)
        throw new Error(`Produto com ID ${id_produto} não encontrado.`);
      return produto;
    } catch (error) {
      console.error(`Erro ao carregar produto com ID ${id_produto}:`, error);
      throw error;
    }
  };

  const addProduto = async (produto) => {
    try {
      const newProduto = await createProduto(produto);
      setProdutos((prev) => [...prev, newProduto]);
      return { success: true, message: "Produto adicionado com sucesso!" };
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      return {
        success: false,
        message:
          "Erro ao adicionar o produto. Verifique os dados e tente novamente.",
      };
    }
  };

  const updateProdutoData = async (id_produto, produtoData) => {
    try {
      const updatedProduto = await updateProduto(id_produto, produtoData);
      setProdutos((prev) =>
        prev.map((produto) =>
          produto.id_produto === id_produto ? updatedProduto : produto
        )
      );
      return { success: true, message: "Produto atualizado com sucesso!" };
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      return {
        success: false,
        message:
          "Erro ao atualizar o produto. Verifique os dados e tente novamente.",
      };
    }
  };

  const removeProduto = async (id_produto) => {
    try {
      await deleteProduto(id_produto);
      setProdutos((prev) =>
        prev.filter((produto) => produto.id_produto !== id_produto)
      );
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };

  return (
    <ProdutoContext.Provider
      value={{
        produtos,
        loading,
        getProduto,
        addProduto,
        updateProdutoData,
        removeProduto,
      }}
    >
      {children}
    </ProdutoContext.Provider>
  );
};
