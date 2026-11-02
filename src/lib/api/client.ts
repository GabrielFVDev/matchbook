import axios, { isAxiosError } from 'axios';
import { apiUrl } from '@/lib/env';
import { getIdToken, logOut } from '@/lib/firebase';

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const request = isAxiosError(error) ? error.config : undefined;
    const status = isAxiosError(error) ? error.response?.status : undefined;
    console.error('API error:', request?.method?.toUpperCase(), request?.url, status);

    if (status === 401) {
      await logOut();
      throw new Error('Sua sessão expirou. Entre de novo.');
    }
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

export const errorMessage = (error: unknown, fallback: string) =>
  (error instanceof Error && error.message) || fallback;
