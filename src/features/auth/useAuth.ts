import { useState } from 'react';
import { authService } from '@/lib/api/services';
import type { SignUpRequest } from '@/lib/api/types';
import { clearSessionUser, getSessionUser, hasSession, saveSessionUser } from '@/lib/session';

// Hook para gerenciar autenticação
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para fazer login
  const login = async (email: string, senha: string) => {
    setLoading(true);
    setError(null);

    try {
      const resultado = await authService.login(email, senha);

      if (resultado.success) {
        // Salva os dados do usuário no localStorage
        saveSessionUser(resultado.data);
        setLoading(false);
        return { success: true as const, usuario: resultado.data };
      } else {
        setError(resultado.error);
        setLoading(false);
        return { success: false as const, error: resultado.error };
      }
    } catch {
      setError('Erro inesperado ao fazer login');
      setLoading(false);
      return { success: false as const, error: 'Erro inesperado ao fazer login' };
    }
  };

  // Função para fazer logout
  const logout = () => {
    clearSessionUser();
  };

  // Função para verificar se está logado
  const isLoggedIn = () => {
    return hasSession();
  };

  // Função para obter usuário atual
  const getCurrentUser = () => {
    return getSessionUser();
  };

  return {
    login,
    logout,
    isLoggedIn,
    getCurrentUser,
    loading,
    error,
    setError,
  };
};

// Hook para cadastro de usuários
export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Função para cadastrar usuário
  const register = async (userData: SignUpRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const resultado = await authService.cadastrar(userData);

      if (resultado.success) {
        setSuccess(true);
        setLoading(false);
        return { success: true as const, data: resultado.data };
      } else {
        setError(resultado.error);
        setLoading(false);
        return { success: false as const, error: resultado.error };
      }
    } catch (err) {
      console.error('Hook: Erro inesperado:', err);
      setError('Erro inesperado ao cadastrar usuário');
      setLoading(false);
      return { success: false as const, error: 'Erro inesperado ao cadastrar usuário' };
    }
  };

  // Função para resetar estados
  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    register,
    loading,
    error,
    success,
    reset,
    setError,
  };
};
