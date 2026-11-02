import type { SessionUser } from '@/lib/types';

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
