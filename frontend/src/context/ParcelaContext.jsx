import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllParcelas, createParcela, updateParcela } from '../services/parcelaService';
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

  const addParcela = async (newParcela) => {
    try{
      const addedParcela = await createParcela(newParcela);
      setParcelas((prev) => [...prev, addedParcela]);
    } catch (error) {
      console.error("Erro ao adicionar parcela:", error)
    }
  };

  const updateParcelaData = async (id, updatedParcela) => {
    try {
      const updated = await updateParcela(id, updatedParcela);
      setParcelas(parcelas.map(parcela => cliente.id_cliente === id ? updated : parcela));
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error)
    }
  };

  return (
    <ParcelaContext.Provider value={{ parcelas, loading, addParcela, updateParcelaData }}>
      {children}
    </ParcelaContext.Provider>
  );
};
