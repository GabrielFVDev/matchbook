import axios from 'axios';

// Configuração base da API
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para tratamento de erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error);

    // Tratamento específico de erros
    if (error.response?.status === 404) {
      throw new Error('Recurso não encontrado');
    }
    if (error.response?.status === 400) {
      throw new Error('Dados inválidos');
    }
    if (error.response?.status === 500) {
      throw new Error('Erro interno do servidor');
    }

    throw error;
  },
);

export default api;
