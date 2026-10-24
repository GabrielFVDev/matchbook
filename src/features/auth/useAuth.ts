import { useState } from 'react';
import { authApi } from '@/lib/api/auth';
import type { SignUpRequest } from '@/lib/api/types';
import { hasSession, saveSessionUser } from '@/lib/session';

// Hook for login and protected routes. To only read or clear the session, use @/lib/session.
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Logs in
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authApi.login(email, password);

      if (result.success) {
        // Stores the user data in localStorage
        saveSessionUser(result.data);
        setLoading(false);
        return { success: true as const, user: result.data };
      } else {
        setError(result.error);
        setLoading(false);
        return { success: false as const, error: result.error };
      }
    } catch {
      setError('Erro inesperado ao fazer login');
      setLoading(false);
      return { success: false as const, error: 'Erro inesperado ao fazer login' };
    }
  };

  // Checks whether someone is logged in
  const isLoggedIn = () => {
    return hasSession();
  };

  return {
    login,
    isLoggedIn,
    loading,
    error,
    setError,
  };
};

// Hook for signing up users
export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Signs up a user
  const signUp = async (userData: SignUpRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await authApi.signUp(userData);

      if (result.success) {
        setSuccess(true);
        setLoading(false);
        return { success: true as const, data: result.data };
      } else {
        setError(result.error);
        setLoading(false);
        return { success: false as const, error: result.error };
      }
    } catch (err) {
      console.error('Hook: unexpected error:', err);
      setError('Erro inesperado ao cadastrar usuário');
      setLoading(false);
      return { success: false as const, error: 'Erro inesperado ao cadastrar usuário' };
    }
  };

  // Resets the states
  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    signUp,
    loading,
    error,
    success,
    reset,
    setError,
  };
};
