import api from './api';

const loginService = {
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await api.post('/login/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const result = response.data;

      localStorage.setItem('access_token', result.access_token);

      const userResponse = await api.get('/login/me', {
        headers: {
          Authorization: `Bearer ${result.access_token}`,
        },
      });

      const userData = userResponse.data;

      localStorage.setItem('user_email', userData.email);
      localStorage.setItem('user_username', userData.username);
      localStorage.setItem('user_permission', userData.permission);

      return userData;
    } catch (error) {
      console.error('Erro no login:', error);
      throw new Error('Email ou senha inválidos');
    }
  },

  getUserFromToken: async (token) => {
    try {
      const response = await api.get('/login/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_username');
    localStorage.removeItem('user_permission');
  },
};

export default loginService;
