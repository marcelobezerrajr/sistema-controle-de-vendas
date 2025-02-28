import React, { createContext, useState, useEffect, useContext } from "react";
import {
  getAllVendas,
  getVendaById,
  createVenda,
  updateVenda,
  deleteVenda,
} from "../services/vendaService";
import { LoginContext } from "./LoginContext";

export const VendaContext = createContext();

export const VendaProvider = ({ children }) => {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(LoginContext);

  useEffect(() => {
    const fetchVendas = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const data = await getAllVendas();
        setVendas(data);
      } catch (error) {
        console.error("Erro ao carregar Vendas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendas();
  }, [user]);

  const getVenda = async (id_venda) => {
    try {
      const venda = await getVendaById(id_venda);
      if (!venda) throw new Error(`Venda com ID ${id_venda} não encontrada.`);
      return venda;
    } catch (error) {
      console.error(`Erro ao carregar venda com ID ${id_venda}:`, error);
      throw error;
    }
  };

  const addVenda = async (newVenda) => {
    try {
      const addedVenda = await createVenda(newVenda);
      setVendas([...vendas, addedVenda]);
      return { success: true, message: "Venda adicionada com sucesso!" };
    } catch (error) {
      console.error("Erro ao adicionar venda:", error);
      return {
        success: false,
        message:
          "Erro ao adicionar a venda. Verifique os dados e tente novamente.",
      };
    }
  };

  const updateVendaData = async (id_venda, updatedVenda) => {
    try {
      const updated = await updateVenda(id_venda, updatedVenda);
      setVendas(
        vendas.map((venda) => (venda.id_venda === id_venda ? updated : venda))
      );
      return { success: true, message: "Venda atualizada com sucesso!" };
    } catch (error) {
      console.error("Erro ao atualizar venda:", error);
      return {
        success: false,
        message:
          "Erro ao atualizar a venda. Verifique os dados e tente novamente.",
      };
    }
  };

  const removeVenda = async (id_venda) => {
    try {
      await deleteVenda(id_venda);
      setVendas(vendas.filter((venda) => venda.id_venda !== id_venda));
    } catch (error) {
      console.error("Erro ao deletar venda:", error);
    }
  };

  return (
    <VendaContext.Provider
      value={{
        vendas,
        loading,
        getVenda,
        addVenda,
        updateVendaData,
        removeVenda,
      }}
    >
      {children}
    </VendaContext.Provider>
  );
};
