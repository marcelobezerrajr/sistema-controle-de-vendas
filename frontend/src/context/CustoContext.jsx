import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllCustos, createCusto } from '../services/custoService'
import { LoginContext } from './LoginContext';


export const CustoContext = createContext();

export const CustoProvider = ({ children }) => {
  const [custos, setCustos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(LoginContext);

  useEffect(() => {
    const fetchCustos = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const data = await getAllCustos();
        setCustos(data);
      } catch (error) {
        console.error('Erro ao carregar Custos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustos();
  }, [user]);

  const addCusto = async (custo) => {
    try {
      const newCusto = await createCusto(custo);
      setCustos((prev) => [...prev, newCusto]);
    } catch (error) {
      console.error("Erro ao adicionar custo:", error);
    }
  };

  return (
    <CustoContext.Provider value={{ custos, loading, addCusto }}>
      {children}
    </CustoContext.Provider>
  );
};
