import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  deleteUser,
  getAdditionalUserInfo,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithPopup,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { setSession } from '@/lib/session';
import type { SessionUser } from '@/lib/types';

if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  throw new Error('Firebase is not configured: create .env.local as the README explains.');
}

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

const auth = getAuth(app);

const google = new GoogleAuthProvider();
google.setCustomParameters({ prompt: 'select_account' });

const toSessionUser = (user: User): SessionUser => ({
  uid: user.uid,
  name: user.displayName,
  email: user.email,
  photoUrl: user.photoURL,
  createdAt: user.metadata.creationTime ?? null,
});

onAuthStateChanged(auth, (user) => setSession(user ? toSessionUser(user) : null));

const publish = () => setSession(auth.currentUser ? toSessionUser(auth.currentUser) : null);

const loggedInUser = () => {
  if (!auth.currentUser) throw new Error('No one is logged in');
  return auth.currentUser;
};

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, google);
  publish();
  return { isNewUser: getAdditionalUserInfo(result)?.isNewUser ?? false };
};

export const logOut = async () => {
  await signOut(auth);
  publish();
};

export const updateName = async (name: string) => {
  await updateProfile(loggedInUser(), { displayName: name });
  publish();
};

export const confirmIdentity = async () => {
  const user = loggedInUser();
  const sameAccount = new GoogleAuthProvider();
  if (user.email) sameAccount.setCustomParameters({ login_hint: user.email });
  await reauthenticateWithPopup(user, sameAccount);
};

export const deleteAccount = async () => {
  await deleteUser(loggedInUser());
  publish();
};

export const getIdToken = async () => (await auth.currentUser?.getIdToken()) ?? null;
