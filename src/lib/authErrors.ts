// The screen text for a Firebase error, which carries a "code" like "auth/invalid-credential".
const messages: Record<string, string> = {
  'auth/email-already-in-use': 'Esse email já tem conta.',
  'auth/invalid-credential': 'Email ou senha incorretos.',
  // The two below only show up in projects without the email enumeration protection.
  'auth/wrong-password': 'Email ou senha incorretos.',
  'auth/user-not-found': 'Email ou senha incorretos.',
  'auth/invalid-email': 'Email inválido.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/too-many-requests': 'Muitas tentativas. Tente de novo em alguns minutos.',
  'auth/network-request-failed': 'Sem conexão. Confira a internet.',
};

const codeOf = (error: unknown) => {
  const code = (error as { code?: unknown } | null)?.code;
  return typeof code === 'string' ? code : null;
};

export const authErrorMessage = (error: unknown, fallback: string) =>
  messages[codeOf(error) ?? ''] || fallback;

// Whether Firebase refused the password, whatever the project's settings.
export const isWrongPassword = (error: unknown) =>
  ['auth/invalid-credential', 'auth/wrong-password'].includes(codeOf(error) ?? '');
