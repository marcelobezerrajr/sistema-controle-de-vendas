import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllFornecedores, getFornecedorById, createFornecedor, updateFornecedor, deleteFornecedor } from '../services/fornecedorService';
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

  const getFornecedor = async (id_fornecedor) => {
    try {
      const fornecedor = await getFornecedorById(id_fornecedor);
      if (!fornecedor) throw new Error(`Fornecedor com ID ${id_fornecedor} não encontrado.`);
      return fornecedor;
    } catch (error) {
      console.error(`Erro ao carregar fornecedor com ID ${id_fornecedor}:`, error);
      throw error;
    }
  };

  const addFornecedor = async (newFornecedor) => {
    try {
      const addedFornecedor = await createFornecedor(newFornecedor);
      setFornecedores([...fornecedores, addedFornecedor]);
      return { success: true, message: 'Fornecedor adicionado com sucesso!' };
    } catch (error) {
      console.error("Erro ao adicionar fornecedor:", error)
      return { success: false, message: 'Erro ao adicionar o fornecedor. Verifique os dados e tente novamente.' };
    }
  };

  const updateFornecedorData = async (id_fornecedor, updatedFornecedor) => {
    try {
      const updated = await updateFornecedor(id_fornecedor, updatedFornecedor);
      setFornecedores(fornecedores.map(fornecedor => fornecedor.id_fornecedor_fornecedor === id_fornecedor ? updated : fornecedor));
      return { success: true, message: 'Fornecedor atualizado com sucesso!' };
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error)
      return { success: false, message: 'Erro ao atualizar o fornecedor. Verifique os dados e tente novamente.' };
    }
  };

  const removeFornecedor = async (id_fornecedor) => {
    try{
      await deleteFornecedor(id_fornecedor);
      setFornecedores(fornecedores.filter(fornecedor => fornecedor.id_fornecedor_fornecedor !== id_fornecedor));
    } catch (error) {
      console.error("Erro ao remover fornecedor:", error)
    }
  };

  return (
    <FornecedorContext.Provider value={{ fornecedores, loading, getFornecedor, addFornecedor, updateFornecedorData, removeFornecedor }}>
      {children}
    </FornecedorContext.Provider>
  );
};
