import type * as RealFirebase from '@/lib/firebase';
import { getSession, setSession } from '@/lib/session';
import type { SessionUser } from '@/lib/types';
import { account, newAccount } from './data';
import type { ResetMockFirebaseOptions } from './types';

// Stand-in for src/lib/firebase.ts in the tests and in "npm run dev:mock" (see vite.config.ts):
// the same exports, with no network. The "Google popup" answers at once with the sample account.

const SESSION_KEY = 'mock-firebase-session';

// What the next Google popup returns. The tests can swap it for an account that does not exist yet.
let nextGoogleAccount = { user: account.user, isNewUser: false };

// Like Firebase, a reload keeps whoever was logged in.
const save = (user: SessionUser | null) => {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
  setSession(user);
};

const saved = localStorage.getItem(SESSION_KEY);
setSession(saved ? (JSON.parse(saved) as SessionUser) : null);

const loggedInUser = () => {
  const session = getSession();
  if (session.status !== 'loggedIn') throw new Error('No one is logged in');
  return session.user;
};

export const signInWithGoogle: typeof RealFirebase.signInWithGoogle = async () => {
  save(nextGoogleAccount.user);
  return { isNewUser: nextGoogleAccount.isNewUser };
};

export const logOut: typeof RealFirebase.logOut = async () => save(null);

export const updateName: typeof RealFirebase.updateName = async (name) =>
  save({ ...loggedInUser(), name });

export const confirmIdentity: typeof RealFirebase.confirmIdentity = async () => {
  loggedInUser();
};

export const deleteAccount: typeof RealFirebase.deleteAccount = async () => {
  loggedInUser();
  save(null);
};

export const getIdToken: typeof RealFirebase.getIdToken = async () => {
  const session = getSession();
  return session.status === 'loggedIn' ? `mock-token-${session.user.uid}` : null;
};

// For the tests: each one starts with the sample account, logged in or not, with or without the
// Google photo.
export const resetMockFirebase = ({ loggedIn, photoUrl = null }: ResetMockFirebaseOptions) => {
  nextGoogleAccount = { user: account.user, isNewUser: false };
  save(loggedIn ? { ...account.user, photoUrl } : null);
};

// For the tests: the next Google popup creates an account.
export const mockNewGoogleAccount = () => {
  nextGoogleAccount = { user: newAccount, isNewUser: true };
};
