import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllCustos, createCusto, getCustoById } from '../services/custoService'
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

  const getCusto = async (id_custo) => {
    try {
      const custo = await getCustoById(id_custo);
      if (!custo) throw new Error(`Custo com ID ${id_custo} não encontrada.`);
      return custo;
    } catch (error) {
      console.error(`Erro ao carregar custo com ID ${id_custo}:`, error);
      throw error;
    }
  };

  const addCusto = async (custo) => {
    try {
      const newCusto = await createCusto(custo);
      setCustos((prev) => [...prev, newCusto]);
      return { success: true, message: 'Custo adicionado com sucesso!' };
    } catch (error) {
      console.error("Erro ao adicionar custo:", error);
      return { success: false, message: 'Erro ao adicionar o custo. Verifique os dados e tente novamente.' };
    }
  };

  return (
    <CustoContext.Provider value={{ custos, loading, addCusto, getCusto }}>
      {children}
    </CustoContext.Provider>
  );
};
