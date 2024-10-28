import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllVendedores, getVendedorById, createVendedor, updateVendedor, deleteVendedor } from '../services/vendedorService';
import { LoginContext } from './LoginContext';

export const VendedorContext = createContext();

export const VendedorProvider = ({ children }) => {
  const [vendedor, setVendedor] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(LoginContext);

  useEffect(() => {
    const fetchVendedores = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const data = await getAllVendedores();
        setVendedor(data);
      } catch (error) {
        console.error('Erro ao carregar Vendedores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendedores();
  }, [user]);

  const getVendedor = async (id_vendedor) => {
    try {
      const vendedor = await getVendedorById(id_vendedor);
      if (!vendedor) throw new Error(`Vendedor com ID ${id_vendedor} não encontrado.`);
      return vendedor;
    } catch (error) {
      console.error(`Erro ao carregar vendedor com ID ${id_vendedor}:`, error);
      throw error;
    }
  };

  const addVendedor = async (vendedor) => {
    try {
      const newVendedor = await createVendedor(vendedor);
      setVendedor((prev) => [...prev, newVendedor]);
      return { success: true, message: 'Vendedor adicionado com sucesso!' };
    } catch (error) {
      console.error("Erro ao adicionar vendedor:", error);
      return { success: false, message: 'Erro ao adicionar o vendedor. Verifique os dados e tente novamente.' };
    }
  };

  const updateVendedorData = async (id_vendedor, vendedorData) => {
    try {
      const updatedVendedor = await updateVendedor(id_vendedor, vendedorData);
      setVendedor((prev) =>
        prev.map((vendedor) => (vendedor.id_vendedor === id_vendedor ? updatedVendedor : vendedor))
      );
      return { success: true, message: 'Vendedor atualizado com sucesso!' };
    } catch (error) {
      console.error("Erro ao atualizar vendedor:", error);
      return { success: false, message: 'Erro ao atualizar o vendedor. Verifique os dados e tente novamente.' };
    }
  };

  const removeVendedor = async (id_vendedor) => {
    try {
      await deleteVendedor(id_vendedor);
      setVendedor((prev) => prev.filter((vendedor) => vendedor.id_vendedor !== id_vendedor));
    } catch (error) {
      console.error("Erro ao deletar vendedor:", error);
    }
  };

  return (
    <VendedorContext.Provider value={{ vendedor, loading, addVendedor, updateVendedorData, getVendedor, removeVendedor }}>
      {children}
    </VendedorContext.Provider>
  );
};
