import React, { createContext, useState, useEffect } from 'react';
import { getAllProdutos, getProdutoById, createProduto, updateProduto, deleteProduto } from '../services/produtoService';

export const ProdutoContext = createContext();

export const ProdutoProvider = ({ children }) => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const data = await getAllProdutos();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao carregar Produtos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProdutos();
  }, []);

  const getProduto = async (id) => {
    try {
      const produto = await getProdutoById(id);
      return produto;
    } catch (error) {
      console.error("Erro ao obter produto:", error);
    }
  };

  const addProduto = async (produto) => {
    try {
      const newProduto = await createProduto(produto);
      setProdutos((prev) => [...prev, newProduto]);
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
  };

  const updateProdutoData = async (id, produtoData) => {
    try {
      const updatedProduto = await updateProduto(id, produtoData);
      setProdutos((prev) =>
        prev.map((produto) => (produto.id === id ? updatedProduto : produto))
      );
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
    }
  };

  const removeProduto = async (id) => {
    try {
      await deleteProduto(id);
      setProdutos((prev) => prev.filter((produto) => produto.id !== id));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };

  return (
    <ProdutoContext.Provider value={{ produtos, loading, getProduto, addProduto, updateProdutoData, removeProduto }}>
      {children}
    </ProdutoContext.Provider>
  );
};
