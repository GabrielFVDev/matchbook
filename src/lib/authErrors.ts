import type { ErrorWithCode } from '@/lib/types';

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

export const authErrorMessage = (error: unknown, fallback: string) => {
  const code = codeOf(error);
  console.warn('Firebase error:', code ?? error);
  return messages[code ?? ''] || fallback;
};

export const isPopupClosed = (error: unknown) =>
  ['auth/popup-closed-by-user', 'auth/cancelled-popup-request'].includes(codeOf(error) ?? '');
