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

  const getCliente = async (id_cliente) => {
    try {
      const cliente = await getClienteById(id_cliente);
      return cliente;
    } catch (error) {
      console.error(`Erro ao carregar cliente com ID ${id_cliente}:`, error);
      throw error;
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

  const updateClienteData = async (id_cliente, updatedCliente) => {
    try {
      const updated = await updateCliente(id_cliente, updatedCliente);
      setClientes(clientes.map(cliente => cliente.id_cliente === id_cliente ? updated : cliente));
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error)
    }
  };

  const removeCliente = async (id_cliente) => {
    try {
      await deleteCliente(id_cliente);
      setClientes(clientes.filter(cliente => cliente.id_cliente !== id_cliente));
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
