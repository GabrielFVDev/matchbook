import { useState } from 'react';
import { authService } from '@/lib/api/services';

// Hook para gerenciar autenticação
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para fazer login
  const login = async (email, senha) => {
    setLoading(true);
    setError(null);

    try {
      const resultado = await authService.login(email, senha);

      if (resultado.success) {
        // Salva os dados do usuário no localStorage
        localStorage.setItem('usuario', JSON.stringify(resultado.data));
        setLoading(false);
        return { success: true, usuario: resultado.data };
      } else {
        setError(resultado.error);
        setLoading(false);
        return { success: false, error: resultado.error };
      }
    } catch (err) {
      setError('Erro inesperado ao fazer login');
      setLoading(false);
      return { success: false, error: 'Erro inesperado ao fazer login' };
    }
  };

  // Função para fazer logout
  const logout = () => {
    localStorage.removeItem('usuario');
  };

  // Função para verificar se está logado
  const isLoggedIn = () => {
    return localStorage.getItem('usuario') !== null;
  };

  // Função para obter usuário atual
  const getCurrentUser = () => {
    const userData = localStorage.getItem('usuario');
    return userData ? JSON.parse(userData) : null;
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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Função para cadastrar usuário
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const resultado = await authService.cadastrar(userData);

      if (resultado.success) {
        setSuccess(true);
        setLoading(false);
        return { success: true, data: resultado.data };
      } else {
        setError(resultado.error);
        setLoading(false);
        return { success: false, error: resultado.error };
      }
    } catch (err) {
      console.error('Hook: Erro inesperado:', err);
      setError('Erro inesperado ao cadastrar usuário');
      setLoading(false);
      return { success: false, error: 'Erro inesperado ao cadastrar usuário' };
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
