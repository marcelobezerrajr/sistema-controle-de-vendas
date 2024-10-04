import React, { createContext, useState, useEffect } from 'react';
import { getAllVendas, getVendaById, createVenda, updateVenda, deleteVenda } from '../services/vendaService';

export const VendaContext = createContext();

export const VendaProvider = ({ children }) => {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchVendas() {
      try {
        const data = await getAllVendas();
        setVendas(data);
      } catch (error) {
        console.error("Erro ao carregar Vendas:", error);
      } finally {
          setLoading(false);
      }
    }
    fetchVendas();
  }, []);

  const getVenda = async (id) => {
    try {
      const venda = await getVendaById(id);
      return venda;
    } catch (error) {
    }
  };

  const addVenda = async (newVenda) => {
    try {
      const addedVenda = await createVenda(newVenda);
      setVendas([...vendas, addedVenda]);
    } catch (error) {
      console.error("Erro ao adicionar venda:", error)
    }
  };

  const updateVendaData = async (id, updatedVenda) => {
    try {
      const updated = await updateVenda(id, updatedVenda);
      setVendas(vendas.map(venda => venda.id_venda === id ? updated : venda));
    } catch (error) {
      console.error("Erro ao atualizar venda:", error)
    }
  };

  const removeVenda = async (id) => {
    try {
      await deleteVenda(id);
      setVendas(vendas.filter(venda => venda.id_venda !== id));
    } catch (error) {
      console.error("Erro ao deletar venda:", error)
    }
  };

  return (
    <VendaContext.Provider value={{ vendas, loading, getVenda, addVenda, updateVendaData, removeVenda }}>
      {children}
    </VendaContext.Provider>
  );
};
