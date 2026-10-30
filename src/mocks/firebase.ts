import type * as RealFirebase from '@/lib/firebase';
import { getSession, setSession } from '@/lib/session';
import type { SessionUser } from '@/lib/session';
import { account } from './data';

// Stand-in for src/lib/firebase.ts in the tests and in "npm run dev:mock" (see vite.config.ts):
// the same exports, with the accounts in memory and no network. It is not a copy of Firebase:
// besides the wrong password and the email already in use, it accepts everything.

const SESSION_KEY = 'mock-firebase-session';

const seedAccounts = () =>
  new Map([[account.email, { password: account.password, user: account.user }]]);

let accounts = seedAccounts();

// Like Firebase, a reload keeps whoever was logged in.
const save = (user: SessionUser | null) => {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
  setSession(user);
};

const saved = localStorage.getItem(SESSION_KEY);
setSession(saved ? (JSON.parse(saved) as SessionUser) : null);

// Firebase errors carry a "code", which src/lib/authErrors.ts turns into the screen text.
const authError = (code: string) => Object.assign(new Error(code), { code });

const loggedInUser = () => {
  const session = getSession();
  if (session.status !== 'loggedIn') throw new Error('No one is logged in');
  return session.user;
};

export const signIn: typeof RealFirebase.signIn = async (email, password) => {
  const found = accounts.get(email);
  if (found?.password !== password) throw authError('auth/invalid-credential');
  save(found.user);
};

export const signUp: typeof RealFirebase.signUp = async (name, email, password) => {
  if (accounts.has(email)) throw authError('auth/email-already-in-use');
  const user = {
    uid: `uid-${accounts.size + 1}`,
    name,
    email,
    photoUrl: null,
    createdAt: new Date().toUTCString(),
  };
  accounts.set(email, { password, user });
  save(user);
};

export const logOut: typeof RealFirebase.logOut = async () => save(null);

export const sendPasswordReset: typeof RealFirebase.sendPasswordReset = async () => {};

export const updateName: typeof RealFirebase.updateName = async (name) =>
  save({ ...loggedInUser(), name });

export const confirmPassword: typeof RealFirebase.confirmPassword = async (password) => {
  const user = loggedInUser();
  if (accounts.get(user.email ?? '')?.password !== password) {
    throw authError('auth/invalid-credential');
  }
};

export const deleteAccount: typeof RealFirebase.deleteAccount = async () => {
  accounts.delete(loggedInUser().email ?? '');
  save(null);
};

export const getIdToken: typeof RealFirebase.getIdToken = async () => {
  const session = getSession();
  return session.status === 'loggedIn' ? `mock-token-${session.user.uid}` : null;
};

// For the tests: each one starts with the sample account only, logged in or not.
export const resetMockFirebase = ({ loggedIn }: { loggedIn: boolean }) => {
  accounts = seedAccounts();
  save(loggedIn ? account.user : null);
};
