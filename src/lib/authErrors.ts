import type { ErrorWithCode } from '@/lib/types';

// The screen text for a Firebase error, which carries a "code" like "auth/popup-blocked".
const messages: Record<string, string> = {
  'auth/popup-blocked':
    'O navegador bloqueou a janela do Google. Libere as janelas pop-up deste site e tente de novo.',
  'auth/user-mismatch': 'Escolha a mesma conta do Google com que você entrou.',
  'auth/too-many-requests': 'Muitas tentativas. Tente de novo em alguns minutos.',
  'auth/network-request-failed': 'Sem conexão. Confira a internet.',
};

const codeOf = (error: unknown) => {
  const code = (error as ErrorWithCode | null)?.code;
  return typeof code === 'string' ? code : null;
};

// The code also goes to the console: a setup problem (like the Google sign-in turned off) shows up
// there without opening the network tab, whose Firebase addresses carry the API key.
export const authErrorMessage = (error: unknown, fallback: string) => {
  const code = codeOf(error);
  console.warn('Firebase error:', code ?? error);
  return messages[code ?? ''] || fallback;
};

// Whether the person closed the Google popup: giving up, not an error to show.
export const isPopupClosed = (error: unknown) =>
  ['auth/popup-closed-by-user', 'auth/cancelled-popup-request'].includes(codeOf(error) ?? '');
