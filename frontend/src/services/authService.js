import api from './api';

// Função de login
export const loginService = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token); // Salva o token no localStorage
    return user; // Retorna os dados do usuário
  } catch (error) {
    throw new Error('Erro ao realizar login.');
  }
};

// Função de logout
export const logoutService = () => {
  localStorage.removeItem('token');
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Função para obter os dados do usuário autenticado
export const getUserDataService = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Usuário não autenticado.');
  }
  
  try {
    const response = await api.get('/me', { // Endpoint para obter informações do usuário
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Retorna os dados do usuário
  } catch (error) {
    throw new Error('Erro ao obter os dados do usuário.');
  }
};
