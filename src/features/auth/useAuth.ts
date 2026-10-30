import { useState } from 'react';
import { accountApi } from '@/lib/api/account';
import type { PreferencesRequest } from '@/lib/api/types';
import { authErrorMessage } from '@/lib/authErrors';
import { sendPasswordReset, signIn, signUp as createAccount } from '@/lib/firebase';

// Hook for logging in. Who is logged in comes from useSession, in @/lib/session.
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Logs in with Firebase
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      await signIn(email.trim(), password);
      setLoading(false);
      return { success: true as const };
    } catch (err) {
      const message = authErrorMessage(err, 'Erro inesperado ao fazer login');
      setError(message);
      setLoading(false);
      return { success: false as const, error: message };
    }
  };

  // Firebase sends the email with the link to choose a new password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordReset(email.trim());
      return { success: true as const };
    } catch (err) {
      return {
        success: false as const,
        error: authErrorMessage(err, 'Não deu para enviar o email. Tente de novo.'),
      };
    }
  };

  return {
    login,
    resetPassword,
    loading,
    error,
    setError,
  };
};

interface NewAccount {
  name: string;
  email: string;
  password: string;
}

// Hook for signing up users
export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Creates the account in Firebase, which logs it in, and then saves the taste in the backend.
  const signUp = async ({ name, email, password }: NewAccount, preferences: PreferencesRequest) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createAccount(name, email, password);
    } catch (err) {
      const message = authErrorMessage(err, 'Erro inesperado ao cadastrar usuário');
      setError(message);
      setLoading(false);
      return { success: false as const, error: message };
    }

    // The account already exists: without the taste, the recommendations just start without it,
    // and the person can fill it in the Profile.
    const saved = await accountApi.savePreferences(preferences);
    if (!saved.success) {
      console.warn('Account created, but the preferences were not saved:', saved.error);
    }

    setSuccess(true);
    setLoading(false);
    return { success: true as const };
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
