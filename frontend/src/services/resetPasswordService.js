import api from './api';

export const verifyResetToken = async (token) => {
    try {
        const response = await api.post('/resetpassword/verify', { token });
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Network error. Please try again later.';
    }
};

export const resetPassword = async (token, newPassword) => {
    try {
        const response = await api.post('/resetpassword/reset', {
            token,
            new_password: newPassword,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'An error occurred.';
    }
};
