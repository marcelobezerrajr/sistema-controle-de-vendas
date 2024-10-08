import React, { createContext, useState } from 'react';
import requestPasswordService from '../services/requestPasswordService';

export const RequestPasswordContext = createContext();

export const RequestPasswordProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const requestPassword = async (email) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await requestPasswordService(email);
      setSuccessMessage(response.message);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao solicitar a recuperação de senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequestPasswordContext.Provider value={{ requestPassword, loading, error, successMessage }}>
      {children}
    </RequestPasswordContext.Provider>
  );
};
