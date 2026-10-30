import { useSyncExternalStore } from 'react';

// Who is logged in. The account (name, email, password, photo) lives in Firebase, and the backend
// only knows the uid. Only src/lib/firebase.ts (or its stand-in in src/mocks) writes here.
export interface SessionUser {
  uid: string;
  name: string | null;
  email: string | null;
  photoUrl: string | null;
  // When the account was created, for "Membro desde".
  createdAt: string | null;
}

// "loading" lasts from the page load until Firebase restores the saved session, or finds none.
export type Session =
  { status: 'loading' } | { status: 'loggedOut' } | { status: 'loggedIn'; user: SessionUser };

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
