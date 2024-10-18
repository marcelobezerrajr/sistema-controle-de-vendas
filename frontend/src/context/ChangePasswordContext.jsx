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
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await changePasswordService(currentPassword, newPassword);
      setMessage('Password changed successfully.');
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
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
