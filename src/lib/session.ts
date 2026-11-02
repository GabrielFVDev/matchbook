import { useSyncExternalStore } from 'react';
import type { Session, SessionUser } from '@/lib/types';

let session: Session = { status: 'loading' };
const listeners = new Set<() => void>();

export const getSession = () => session;

export const setSession = (user: SessionUser | null) => {
  session = user ? { status: 'loggedIn', user } : { status: 'loggedOut' };
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useSession = () => useSyncExternalStore(subscribe, getSession);

export const useSessionUser = () => {
  const current = useSession();
  return current.status === 'loggedIn' ? current.user : null;
};
