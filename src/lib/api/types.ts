// The data as the backend sends and receives it (docs/CONTRATO-API.md). The account itself
// (name, email, photo) is not here: it lives in Firebase, see SessionUser in src/lib/session.ts.

export interface BookDto {
  id: number;
  title: string;
  author: string;
  genre: string;
  publisher?: string | null;
  publicationYear?: number | null;
  pageCount?: number | null;
  language?: string | null;
  synopsis?: string | null;
  coverUrl?: string | null;
  photoUrl?: string | null;
  createdAt?: string | null;
  // null on the shared books (the seed); the uid of whoever created it on the others.
  ownerUid?: string | null;
}

// What the Add book form sends.
export interface CreateBookRequest {
  title: string;
  author: string;
  publisher: string;
  genre: string;
  publicationYear: number | null;
  pageCount: number | null;
  language: string;
  synopsis: string;
  coverUrl: string | null;
}

export type ReadingLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Preferences {
  firebaseUid: string;
  favoriteGenre: string | null;
  favoriteAuthor: string | null;
  readingLevel: ReadingLevel | null;
  receiveRecommendations: boolean;
}

// What goes in PUT /me/preferences. It replaces everything, and the uid comes from the token.
export type PreferencesRequest = Omit<Preferences, 'firebaseUid'>;

export type Strategy = 'DEFAULT' | 'REFINED' | 'DIVERSIFIED' | 'EXPLORATORY';

export interface RecommendationStats {
  totalRejections: number;
  totalAcceptances: number;
  // From 0 to 100.
  acceptanceRate: number;
  currentStrategy: Strategy;
}

export interface RejectResult {
  totalRejections: number;
  algorithmChanged: boolean;
  // Already in Portuguese, ready for the screen.
  suggestion: string;
}

export interface LikedCount {
  total: number;
}

// What each function in src/lib/api returns: it never throws, it always answers in this shape.
export type ApiResult<T, F = null> =
  { success: true; data: T; message: string | null } | { success: false; data: F; error: string };
