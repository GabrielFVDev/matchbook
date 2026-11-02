import { useSyncExternalStore } from 'react';
import type { Session, SessionUser } from '@/lib/types';

// Who is logged in. The account (name, email, password, photo) lives in Firebase, and the backend
// only knows the uid. Only src/lib/firebase.ts (or its stand-in in src/mocks) writes here.
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

// The logged-in user, or null. The screens behind ProtectedRoute always get one.
export const useSessionUser = () => {
  const current = useSession();
  return current.status === 'loggedIn' ? current.user : null;
};
