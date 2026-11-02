import type { ReactNode } from 'react';

export type CoverSize = 'match' | 'demo' | 'grid' | 'preview' | 'mini';

export interface BookCoverProps {
  title?: string | null;
  genre?: string | null;
  coverUrl?: string | null;
  size?: CoverSize;
  placeholderTitle?: string;
  children?: ReactNode;
}
