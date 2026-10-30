import { initializeApp } from 'firebase/app';
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { setSession } from '@/lib/session';
import type { SessionUser } from '@/lib/session';

// The only file that talks to Firebase. In the tests and in "npm run dev:mock", vite.config.ts
// swaps it for src/mocks/firebase.ts, which has the same exports and no network.

if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  throw new Error('Firebase is not configured: create .env.local as the README explains.');
}

// These values go in the bundle on purpose: what protects the data is the backend checking the token.
const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

const auth = getAuth(app);

const toSessionUser = (user: User): SessionUser => ({
  uid: user.uid,
  name: user.displayName,
  email: user.email,
  photoUrl: user.photoURL,
  createdAt: user.metadata.creationTime ?? null,
});

// Firebase restores the saved session a moment after the page loads, and tells here every login
// and logout, including the ones from another tab.
onAuthStateChanged(auth, (user) => setSession(user ? toSessionUser(user) : null));

// The functions below also publish the session themselves when they finish, so the screen that
// called them can navigate right away, without waiting for the listener above.
const publish = () => setSession(auth.currentUser ? toSessionUser(auth.currentUser) : null);

const loggedInUser = () => {
  if (!auth.currentUser) throw new Error('No one is logged in');
  return auth.currentUser;
};

export const signIn = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
  publish();
};

// Creates the account with the name on the profile. Firebase logs the new account in right away.
export const signUp = async (name: string, email: string, password: string) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: name });
  publish();
};

export const logOut = async () => {
  await signOut(auth);
  publish();
};

// Firebase sends the email with the link to choose a new password.
export const sendPasswordReset = (email: string) => sendPasswordResetEmail(auth, email);

export const updateName = async (name: string) => {
  await updateProfile(loggedInUser(), { displayName: name });
  publish();
};

// Firebase only deletes an account with a recent login, so the password is asked again first.
export const confirmPassword = async (password: string) => {
  const user = loggedInUser();
  await reauthenticateWithCredential(
    user,
    EmailAuthProvider.credential(user.email ?? '', password),
  );
};

export const deleteAccount = async () => {
  await deleteUser(loggedInUser());
  publish();
};

// The token of every call to the API. Firebase renews it by itself when it is about to expire.
export const getIdToken = async () => (await auth.currentUser?.getIdToken()) ?? null;
