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
      if (!usuario) throw new Error(`Usuário com ID ${id_user} não encontrado.`);
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
      return { success: true, message: 'Usuário adicionado com sucesso!' };
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error)
      return { success: false, message: 'Erro ao adicionar o usuário. Verifique os dados e tente novamente.' };
    }
  };

  const updateUsuarioData = async (id_user, updatedUsuario) => {
    try {
      const updated = await updateUsuario(id_user, updatedUsuario);
      setUsuarios(usuarios.map(user => user.id_user === id_user ? updated : user));
      return { success: true, message: 'Usuário atualizado com sucesso!' };
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error)
      return { success: false, message: 'Erro ao atualizar o usuário. Verifique os dados e tente novamente.' };
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
