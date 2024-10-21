import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario } from '../services/usuarioService';
import { LoginContext } from './LoginContext';

export const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(LoginContext);

  useEffect(() => {
    const fetchUsuarios = async () => {
      if (!user) return;
    
      setLoading(true);
      try {
        const data = await getAllUsuarios();
        console.log("Dados retornados:", data);
        setUsuarios(data);
      } catch (error) {
        console.error('Erro ao carregar Usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [user]);

  const getUsuario = async (id_user) => {
    try {
      const usuario = await getUsuarioById(id_user);
      return usuario;
    } catch (error) {
      console.error(`Erro ao carregar usuário com ID ${id_user}:`, error);
      throw error;
    }
  };

  const addUsuario = async (newUsuario) => {
    try {
      const addedUsuario = await createUsuario(newUsuario);
      setUsuarios([...usuarios, addedUsuario]);
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error)
    }
  };

  const updateUsuarioData = async (id_user, updatedUsuario) => {
    try {
      const updated = await updateUsuario(id_user, updatedUsuario);
      setUsuarios(usuarios.map(user => user.id_user === id_user ? updated : user));
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error)
    }
  };

  const removeUsuario = async (id_user) => {
    try {
      await deleteUsuario(id_user);
      setUsuarios(usuarios.filter(user => user.id_user !== id_user));
    } catch (error) {
      console.error("Erro ao deletar usuário:", error)
    }
  };

  return (
    <UsuarioContext.Provider value={{ usuarios, loading, getUsuario, addUsuario, updateUsuarioData, removeUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};
