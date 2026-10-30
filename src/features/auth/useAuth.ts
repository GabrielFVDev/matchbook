import { useState } from 'react';
import { authErrorMessage, isPopupClosed } from '@/lib/authErrors';
import { signInWithGoogle } from '@/lib/firebase';

// Hook for the "Entrar com Google" button, in the login and in the sign-up. Who is logged in comes
// from useSession, in @/lib/session.
export const useGoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Opens the Google popup. isNewUser tells whether the account was just created.
  const signIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { isNewUser } = await signInWithGoogle();
      setLoading(false);
      return { success: true as const, isNewUser };
    } catch (err) {
      setLoading(false);
      // Closing the popup is giving up, not an error.
      if (isPopupClosed(err)) return { success: false as const };
      setError(authErrorMessage(err, 'Não deu para entrar com o Google. Tente de novo.'));
      return { success: false as const };
    }
  };

  return { signIn, loading, error };
};
