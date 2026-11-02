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
  ownerUid?: string | null;
}

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

export type PreferencesRequest = Omit<Preferences, 'firebaseUid'>;

export type Strategy = 'DEFAULT' | 'REFINED' | 'DIVERSIFIED' | 'EXPLORATORY';

export interface RecommendationStats {
  totalRejections: number;
  totalAcceptances: number;
  acceptanceRate: number;
  currentStrategy: Strategy;
}

export interface RejectResult {
  totalRejections: number;
  algorithmChanged: boolean;
  suggestion: string;
}

export interface LikedCount {
  total: number;
}

export type ApiResult<T, F = null> =
  { success: true; data: T; message: string | null } | { success: false; data: F; error: string };
