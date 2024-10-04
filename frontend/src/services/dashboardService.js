// src/services/dashboardService.js
import axios from 'axios';

// URL base da API
const API_URL = 'https://api.exemplo.com'; // Troque pelo endpoint da sua API

// Função para obter as estatísticas gerais
export const getEstatisticasGerais = async () => {
  try {
    const response = await axios.get(`${API_URL}/estatisticas-gerais`);
    
    // Verifica se a resposta foi bem-sucedida
    if (response.status === 200) {
      return response.data; // Retorna os dados da API
    } else {
      throw new Error('Erro ao buscar estatísticas gerais');
    }
  } catch (error) {
    console.error('Erro ao obter estatísticas gerais:', error);
    throw error;
  }
};
