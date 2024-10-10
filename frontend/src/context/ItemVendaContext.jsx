import React, { createContext, useState, useEffect, useContext } from 'react';
import { createItemVenda, getAllItemVenda } from '../services/itemVendaService';
import { LoginContext } from './LoginContext';

export const ItemVendaContext = createContext();

export const ItemVendaProvider = ({ children }) => {
  const [itemVenda, setItemVenda] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(LoginContext);

  useEffect(() => {
    const fetchItemVenda = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const data = await getAllItemVenda();
        setItemVenda(data);
      } catch (error) {
        console.error('Erro ao carregar Item Venda:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemVenda();
  }, [user]);

  const addItemVenda = async (itemvenda) => {
    try {
      const newItemVenda = await createItemVenda(itemvenda);
      setItemVenda((prev) => [...prev, newItemVenda]);
    } catch (error) {
      console.error("Erro ao adicionar item venda:", error);
    }
  };

  return (
    <ItemVendaContext.Provider value={{ itemVenda, loading, addItemVenda }}>
      {children}
    </ItemVendaContext.Provider>
  );
};
