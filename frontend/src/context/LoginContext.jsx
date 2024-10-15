import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loginService from '../services/loginService';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      loginService
        .getUserFromToken(token)
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const userData = await loginService.login(email, password);
      setUser(userData);
      navigate('/clientes');
    } catch (error) {
      setError(error.message);
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    loginService.logout();
    setUser(null);
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <LoginContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </LoginContext.Provider>
  );
};
