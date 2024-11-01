import React, { createContext, useState, useEffect, useContext } from 'react';
import { createComissao, getAllComissoes, getComissaoById, calculateComissao } from '../services/comissaoService';
import { LoginContext } from './LoginContext';

export const ComissaoContext = createContext();

export const ComissaoProvider = ({ children }) => {
  const [comissoes, setComissoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(LoginContext);

  useEffect(() => {
    const fetchComissoes = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const data = await getAllComissoes();
        setComissoes(data);
      } catch (error) {
        console.error('Erro ao carregar Comissões:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComissoes();
  }, [user]);

  const getComissao = async (id_comissao) => {
    try {
      const comissao = await getComissaoById(id_comissao);
      if (!comissao) throw new Error(`Comissão com ID ${id_comissao} não encontrada.`);
      return comissao;
    } catch (error) {
      console.error(`Erro ao carregar comissão com ID ${id_comissao}:`, error);
      throw error;
    }
  };

  const addComissao = async (comissao) => {
    try {
      const newComissao = await createComissao(comissao);
      setComissoes((prev) => [...prev, newComissao]);
      return { success: true, message: 'Comissão adicionada com sucesso!' };
    } catch (error) {
      console.error("Erro ao adicionar comissão:", error);
      return { success: false, message: 'Erro ao adicionar a comissão. Verifique os dados e tente novamente.' };
    }
  };

  const calcularComissao = async (id_vendedor, id_parcela) => {
    try {
      const data = await calculateComissao(id_vendedor, id_parcela);
      return data;
    } catch (error) {
      console.error("Erro ao calcular comissão:", error);
      throw error;
    }
  };

  return (
    <ComissaoContext.Provider value={{ comissoes, loading, addComissao, getComissao, calcularComissao }}>
      {children}
    </ComissaoContext.Provider>
  );
};
