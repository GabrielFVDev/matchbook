import axios, { isAxiosError } from 'axios';
import { apiUrl } from '@/lib/env';

// Configuração base da API
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para tratamento de erros globais
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    console.error('Erro na API:', error);

    const status = isAxiosError(error) ? error.response?.status : undefined;

    // Tratamento específico de erros
    if (status === 404) {
      throw new Error('Recurso não encontrado');
    }
    if (status === 400) {
      throw new Error('Dados inválidos');
    }
    if (status === 500) {
      throw new Error('Erro interno do servidor');
    }

    throw error;
  },
);

export default api;

// A mensagem de um erro pego num catch, ou a mensagem padrão de quem chamou.
export const errorMessage = (error: unknown, fallback: string) =>
  (error instanceof Error && error.message) || fallback;
