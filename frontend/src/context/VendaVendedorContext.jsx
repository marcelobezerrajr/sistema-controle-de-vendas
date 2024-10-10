import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllVendaVendedor, getVendasByVendedor, createVendaVendedor } from '../services/vendaVendedorService';
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

  const getVendaVendedor = async (id) => {
    try {
      const vendaByVendedor = await getVendasByVendedor(id);
      return vendaByVendedor;
    } catch (error) {
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
    <VendaVendedorContext.Provider value={{ vendaVendedor, loading, getVendaVendedor, addVendaVendedor }}>
      {children}
    </VendaVendedorContext.Provider>
  );
};
