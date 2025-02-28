import React, { createContext, useState, useEffect, useContext } from "react";
import {
  createItemVenda,
  getAllItemVenda,
  getItemVendaById,
} from "../services/itemVendaService";
import { LoginContext } from "./LoginContext";

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
        console.error("Erro ao carregar Item Venda:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemVenda();
  }, [user]);

  const getItemVenda = async (id_item_venda) => {
    try {
      const itemvenda = await getItemVendaById(id_item_venda);
      if (!itemvenda)
        throw new Error(`Venda com ID ${id_item_venda} não encontrada.`);
      return itemvenda;
    } catch (error) {
      console.error(`Erro ao carregar venda com ID ${id_item_venda}:`, error);
      throw error;
    }
  };

  const addItemVenda = async (itemvenda) => {
    try {
      const newItemVenda = await createItemVenda(itemvenda);
      setItemVenda((prev) => [...prev, newItemVenda]);
      return { success: true, message: "Item Venda adicionado com sucesso!" };
    } catch (error) {
      console.error("Erro ao adicionar item venda:", error);
      return {
        success: false,
        message:
          "Erro ao atualizar o item venda. Verifique os dados e tente novamente.",
      };
    }
  };

  return (
    <ItemVendaContext.Provider
      value={{ itemVenda, loading, addItemVenda, getItemVenda }}
    >
      {children}
    </ItemVendaContext.Provider>
  );
};
