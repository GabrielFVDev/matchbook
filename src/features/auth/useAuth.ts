import { useState } from 'react';
import { authErrorMessage, isPopupClosed } from '@/lib/authErrors';
import { signInWithGoogle } from '@/lib/firebase';

export const useGoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { isNewUser } = await signInWithGoogle();
      setLoading(false);
      return { success: true as const, isNewUser };
    } catch (err) {
      setLoading(false);
      if (isPopupClosed(err)) return { success: false as const };
      setError(authErrorMessage(err, 'Não deu para entrar com o Google. Tente de novo.'));
      return { success: false as const };
    }
  };

  return { signIn, loading, error };
};
