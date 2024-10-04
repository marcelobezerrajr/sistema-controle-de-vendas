import React, { createContext, useState, useEffect } from 'react';
import { loginService, logoutService, getUserDataService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Checa se o usuário está autenticado
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userData = await getUserDataService();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const login = async (email, password) => {
    const userData = await loginService(email, password);
    setUser(userData);
  };

  const logout = async () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
