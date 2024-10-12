import React, { createContext, useState, useEffect, useContext } from 'react';
import { createComissao, getAllComissoes, getComissaoById } from '../services/comissaoService';
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
      return comissao;
    } catch (error) {
    }
  };

  const addComissao = async (comissao) => {
    try {
      const newComissao = await createComissao(comissao);
      setComissoes((prev) => [...prev, newComissao]);
    } catch (error) {
      console.error("Erro ao adicionar comissao:", error);
    }
  };

  return (
    <ComissaoContext.Provider value={{ comissoes, loading, addComissao, getComissao }}>
      {children}
    </ComissaoContext.Provider>
  );
};
