import React, { createContext, useState } from 'react';
import { changePasswordService } from '../services/changePasswordService';

export const ChangePasswordContext = createContext();

export const ChangePasswordProvider = ({ children }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await changePasswordService(currentPassword, newPassword);
      setMessage(response.message || 'Senha alterada com sucesso!');
    } catch (err) {
      setError(err.message || 'Erro ao tentar alterar a senha');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <ChangePasswordContext.Provider
      value={{
        currentPassword,
        newPassword,
        confirmPassword,
        error,
        loading,
        message,
        showPasswords,
        setCurrentPassword,
        setNewPassword,
        setConfirmPassword,
        handleChangePassword,
        togglePasswordVisibility,
      }}
    >
      {children}
    </ChangePasswordContext.Provider>
  );
};
