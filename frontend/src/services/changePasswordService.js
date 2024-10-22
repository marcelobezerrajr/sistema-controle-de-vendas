import api from './api';

export const changePasswordService = async (currentPassword, newPassword) => {
  try {
    const response = await api.post('/change-password/', {
      current_password: currentPassword,
      new_password: newPassword,
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Erro ao tentar alterar a senha');
    }

    throw new Error('Ocorreu um erro inesperado ao tentar alterar a senha.');
  }
};
