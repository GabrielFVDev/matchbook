import axios, { isAxiosError } from 'axios';
import { apiUrl } from '@/lib/env';

// Base API configuration
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    console.error('Erro na API:', error);

    const status = isAxiosError(error) ? error.response?.status : undefined;

    // Specific error handling
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

// The message of an error caught in a catch, or the caller's default message.
export const errorMessage = (error: unknown, fallback: string) =>
  (error instanceof Error && error.message) || fallback;
