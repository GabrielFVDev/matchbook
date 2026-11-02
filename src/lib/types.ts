import type { ReactNode } from 'react';

// The taste form, as TasteFields fills it.
export interface TasteForm {
  favoriteGenre: string;
  favoriteAuthor: string;
  readingLevel: string;
  receiveRecommendations: boolean;
}

export interface LikedCountValue {
  // null while the counter has not arrived from the API yet.
  total: number | null;
  load: () => void;
  add: (amount: number) => void;
  set: (value: number | null) => void;
}

export interface LikedCountProviderProps {
  children: ReactNode;
}

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

export interface ErrorWithCode {
  code?: unknown;
}
