import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllFornecedores, createFornecedor, updateFornecedor, deleteFornecedor } from '../services/fornecedorService';
import { LoginContext } from './LoginContext';

export const FornecedorContext = createContext();

export const FornecedorProvider = ({ children }) => {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(LoginContext);

  useEffect(() => {
    const fetchFornecedores = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const data = await getAllFornecedores();
        setFornecedores(data);
      } catch (error) {
        console.error('Erro ao carregar Fornecedores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFornecedores();
  }, [user]);

  const addFornecedor = async (newFornecedor) => {
    try {
      const addedFornecedor = await createFornecedor(newFornecedor);
      setFornecedores([...fornecedores, addedFornecedor]);
    } catch (error) {
      console.error("Erro ao adicionar fornecedor:", error)
    }
  };

  const updateFornecedorData = async (id, updatedFornecedor) => {
    try {
      const updated = await updateFornecedor(id, updatedFornecedor);
      setFornecedores(fornecedores.map(fornecedor => fornecedor.id_fornecedor === id ? updated : fornecedor));
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error)
    }
  };

  const removeFornecedor = async (id) => {
    try{
      await deleteFornecedor(id);
      setFornecedores(fornecedores.filter(fornecedor => fornecedor.id_fornecedor !== id));
    } catch (error) {
      console.error("Erro ao remover fornecedor:", error)
    }
  };

  return (
    <FornecedorContext.Provider value={{ fornecedores, loading, addFornecedor, updateFornecedorData, removeFornecedor }}>
      {children}
    </FornecedorContext.Provider>
  );
};
