import type { PreferencesRequest, ReadingLevel } from '@/lib/api/types';
import type { TasteForm } from '@/lib/types';

export const toPreferencesRequest = (form: TasteForm): PreferencesRequest => ({
  favoriteGenre: form.favoriteGenre.trim() || null,
  favoriteAuthor: form.favoriteAuthor.trim() || null,
  readingLevel: (form.readingLevel || null) as ReadingLevel | null,
  receiveRecommendations: form.receiveRecommendations,
});
