import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllParcelas, getParcelaById, createParcela, updateParcela } from '../services/parcelaService';
import { LoginContext } from './LoginContext';

export const ParcelaContext = createContext();

export const ParcelaProvider = ({ children }) => {
  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(LoginContext);

  useEffect(() => {
    const fetchParcelas = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const data = await getAllParcelas();
        setParcelas(data);
      } catch (error) {
        console.error('Erro ao carregar Parcelas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParcelas();
  }, [user]);

  const getParcela = async (id_parcela) => {
    try {
      const parcela = await getParcelaById(id_parcela);
      return parcela;
    } catch (error) {
      console.error(`Erro ao carregar parcela com ID ${id_parcela}:`, error);
      throw error;
    }
  };

  const addParcela = async (newParcela) => {
    try{
      const addedParcela = await createParcela(newParcela);
      setParcelas((prev) => [...prev, addedParcela]);
    } catch (error) {
      console.error("Erro ao adicionar parcela:", error)
    }
  };

  const updateParcelaData = async (id_parcela, updatedParcela) => {
    try {
      const updated = await updateParcela(id_parcela, updatedParcela);
      setParcelas(parcelas.map(parcela => parcela.id_parcela === id_parcela ? updated : parcela));
    } catch (error) {
      console.error("Erro ao atualizar parcela:", error)
    }
  };

  return (
    <ParcelaContext.Provider value={{ parcelas, loading, getParcela, addParcela, updateParcelaData }}>
      {children}
    </ParcelaContext.Provider>
  );
};
