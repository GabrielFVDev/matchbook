import type { UserDto } from '@/lib/api/types';

// A sessão de quem entrou é o usuário salvo no localStorage com a chave "usuario", sem a senha.
// Este é o único lugar que lê e grava essa chave; mudar o nome dela deslogaria quem já entrou.
const SESSION_KEY = 'usuario';

export type SessionUser = Omit<UserDto, 'senha'>;

export const getSessionUser = (): SessionUser | null => {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? (JSON.parse(data) as SessionUser) : null;
};

export const hasSession = () => localStorage.getItem(SESSION_KEY) !== null;

export const saveSessionUser = (user: SessionUser) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const clearSessionUser = () => {
  localStorage.removeItem(SESSION_KEY);
};
