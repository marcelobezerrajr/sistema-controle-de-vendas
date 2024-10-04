import React, { createContext, useState, useEffect } from 'react';
import { createComissao, getAllComissoes } from '../services/comissaoService';

export const ComissaoContext = createContext();

export const ComissaoProvider = ({ children }) => {
  const [comissoes, setComissoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComissoes() {
      try {
        const data = await getAllComissoes();
        setComissoes(data);
      } catch (error) {
        console.error("Erro ao carregar Comissões:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchComissoes();
  }, []);

  const addComissao = async (comissao) => {
    try {
      const newComissao = await createComissao(comissao);
      setComissoes((prev) => [...prev, newComissao]);
    } catch (error) {
      console.error("Erro ao adicionar comissao:", error);
    }
  };

  return (
    <ComissaoContext.Provider value={{ comissoes, loading, addComissao }}>
      {children}
    </ComissaoContext.Provider>
  );
};
