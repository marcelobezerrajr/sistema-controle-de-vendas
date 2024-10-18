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
      throw new Error(error.response.data.detail || 'Failed to change password');
    }
    throw new Error('An unexpected error occurred');
  }
};
