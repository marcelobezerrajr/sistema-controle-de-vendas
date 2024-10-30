import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllVendaVendedor, getVendasByVendedor, getVendaVendedor, createVendaVendedor } from '../services/vendaVendedorService';
import { LoginContext } from './LoginContext';

export const VendaVendedorContext = createContext();

export const VendaVendedorProvider = ({ children }) => {
  const [vendaVendedor, setVendaVendedor] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(LoginContext);

  useEffect(() => {
    const fetchVendaVendedor = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const data = await getAllVendaVendedor();
        setVendaVendedor(data);
      } catch (error) {
        console.error('Erro ao carregar Venda Vendedor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendaVendedor();
  }, [user]);

  const getVendaByVendedor = async (id_vendedor) => {
    try {
      const vendaByVendedor = await getVendasByVendedor(id_vendedor);
      if (!vendaByVendedor) throw new Error(`Venda Vendedor com ID ${id_vendedor} não encontrada.`);
      return vendaByVendedor;
    } catch (error) {
      console.error(`Erro ao carregar venda vendedor com ID ${id_vendedor}:`, error);
      throw error;
    }
  };

  const getVendaVendedor = async (id_venda, id_vendedor) => {
    try {
      const vendaByVendedor = await getVendaVendedor(id_venda, id_vendedor);
      if (!vendaByVendedor) throw new Error(`Venda Vendedor com ID de venda ${id_venda} e com ID de Vendedor ${id_vendedor} não encontrada.`);
      return vendaByVendedor;
    } catch (error) {
      console.error(`Erro ao carregar venda vendedor com ID de venda ${id_venda} e ID do vendedor ${id_vendedor}:`, error);
      throw error;
    }
  };

  const addVendaVendedor = async (newVendaVendedor) => {
    try {
      const addedVendaVendedor = await createVendaVendedor(newVendaVendedor);
      setVendaVendedor([...vendaVendedor, addedVendaVendedor]);
    } catch (error) {
      console.error("Erro ao adicionar venda-vendedor:", error)
    }
  };

  return (
    <VendaVendedorContext.Provider value={{ vendaVendedor, loading, getVendaByVendedor, addVendaVendedor }}>
      {children}
    </VendaVendedorContext.Provider>
  );
};
