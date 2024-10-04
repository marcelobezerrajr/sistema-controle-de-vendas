import React, { createContext, useState, useEffect } from 'react';
import { getAllVendaVendedor, getVendasByVendedor, createVendaVendedor } from '../services/vendaVendedorService';

export const VendaVendedorContext = createContext();

export const VendaVendedorProvider = ({ children }) => {
  const [vendaVendedor, setVendaVendedor] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchVendaVendedor() {
      try {
        const data = await getAllVendaVendedor();
        setVendaVendedor(data);
      } catch (error) {
        console.error("Erro ao carregar Venda Vendedor:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVendaVendedor();
  }, []);

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
