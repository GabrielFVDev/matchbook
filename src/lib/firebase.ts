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

// The only way in is the Google account. The chooser always shows, so whoever is logged in to more
// than one Google account in the browser picks which one.
const google = new GoogleAuthProvider();
google.setCustomParameters({ prompt: 'select_account' });

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

// Opens the Google popup. The same call logs in and creates the account: isNewUser tells which.
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

// Firebase only deletes an account with a recent login, so the Google popup opens again first.
export const confirmIdentity = async () => {
  await reauthenticateWithPopup(loggedInUser(), google);
};

export const deleteAccount = async () => {
  await deleteUser(loggedInUser());
  publish();
};

// The token of every call to the API. Firebase renews it by itself when it is about to expire.
export const getIdToken = async () => (await auth.currentUser?.getIdToken()) ?? null;
