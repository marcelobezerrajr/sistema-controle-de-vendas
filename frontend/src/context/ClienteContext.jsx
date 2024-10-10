import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllClientes, getClienteById, createCliente, updateCliente, deleteCliente } from '../services/clienteService';
import { LoginContext } from './LoginContext';

export const ClienteContext = createContext();

export const ClienteProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(LoginContext);

  useEffect(() => {
    const fetchClientes = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const data = await getAllClientes();
        setClientes(data);
      } catch (error) {
        console.error('Erro ao carregar Clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [user]);

  const getCliente = async (id) => {
    try {
      const cliente = await getClienteById(id);
      return cliente;
    } catch (error) {
    }
  };

  const addCliente = async (newCliente) => {
    try {
      const addedCliente = await createCliente(newCliente);
      setClientes([...clientes, addedCliente]);
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error)
    }
  };

  const updateClienteData = async (id, updatedCliente) => {
    try {
      const updated = await updateCliente(id, updatedCliente);
      setClientes(clientes.map(cliente => cliente.id_cliente === id ? updated : cliente));
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error)
    }
  };

  const removeCliente = async (id) => {
    try {
      await deleteCliente(id);
      setClientes(clientes.filter(cliente => cliente.id_cliente !== id));
    } catch (error) {
      console.error("Erro ao deletar cliente:", error)
    }
  };

  return (
    <ClienteContext.Provider value={{ clientes, loading, getCliente, addCliente, updateClienteData, removeCliente }}>
      {children}
    </ClienteContext.Provider>
  );
};
