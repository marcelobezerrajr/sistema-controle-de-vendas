import api from './api';

const requestPasswordService = async (email) => {
  try {
    const response = await api.post('/reset-password/request-password', { email });

    if (!response || response.status !== 200) {
      throw new Error('Erro ao solicitar recuperação de senha.');
    }

    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    } else {
      throw new Error(error.message || 'Erro desconhecido no serviço de recuperação de senha.');
    }
  }
};

export default requestPasswordService;
