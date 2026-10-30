import type { PreferencesRequest, ReadingLevel } from '@/lib/api/types';

// Helpers for formatting and validating data

// Validates an email
export const isValidEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// The taste form, as TasteFields fills it.
interface TasteForm {
  favoriteGenre: string;
  favoriteAuthor: string;
  readingLevel: string;
  receiveRecommendations: boolean;
}

// The taste form as it goes to PUT /me/preferences: trimmed text, and blank fields as null.
export const toPreferencesRequest = (form: TasteForm): PreferencesRequest => ({
  favoriteGenre: form.favoriteGenre.trim() || null,
  favoriteAuthor: form.favoriteAuthor.trim() || null,
  readingLevel: (form.readingLevel || null) as ReadingLevel | null,
  receiveRecommendations: form.receiveRecommendations,
});
