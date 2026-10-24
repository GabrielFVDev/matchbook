import type { UserDto } from '@/lib/api/types';

// The session is the logged-in user, saved in localStorage under "usuario" without the password.
// The only place that reads and writes that key; renaming it would log out everyone logged in.
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
