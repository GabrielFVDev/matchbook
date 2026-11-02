import type { ReactNode } from 'react';

export interface TasteForm {
  favoriteGenre: string;
  favoriteAuthor: string;
  readingLevel: string;
  receiveRecommendations: boolean;
}

export interface LikedCountValue {
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
  createdAt: string | null;
}

export type Session =
  { status: 'loading' } | { status: 'loggedOut' } | { status: 'loggedIn'; user: SessionUser };

export interface ErrorWithCode {
  code?: unknown;
}
