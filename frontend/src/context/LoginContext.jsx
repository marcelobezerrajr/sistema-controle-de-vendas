import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginService from '../services/loginService';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const userData = await loginService.login(email, password);
      setUser(userData);
      navigate('/clientes');
    } catch (err) {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    loginService.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <LoginContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </LoginContext.Provider>
  );
};
