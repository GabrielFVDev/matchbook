import type { SessionUser } from '@/lib/types';

// The edit form: the name goes to Firebase, the taste to PUT /me/preferences.
export interface ProfileForm {
  name: string;
  favoriteGenre: string;
  favoriteAuthor: string;
  readingLevel: string;
  receiveRecommendations: boolean;
}

export interface ProfileAvatarProps {
  user: SessionUser;
}

export interface ProfileNotice {
  text: string;
  id: number;
}
