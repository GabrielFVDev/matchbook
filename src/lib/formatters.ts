import type { PreferencesRequest, ReadingLevel } from '@/lib/api/types';
import type { TasteForm } from '@/lib/types';

// The taste form as it goes to PUT /me/preferences: trimmed text, and blank fields as null.
export const toPreferencesRequest = (form: TasteForm): PreferencesRequest => ({
  favoriteGenre: form.favoriteGenre.trim() || null,
  favoriteAuthor: form.favoriteAuthor.trim() || null,
  readingLevel: (form.readingLevel || null) as ReadingLevel | null,
  receiveRecommendations: form.receiveRecommendations,
});
