import { createContext, useContext } from 'react';
import type { LikedCountValue } from '@/lib/types';

// Counter of liked books shown in the header of every screen.
export const LikedCountContext = createContext<LikedCountValue>({
  total: null,
  load: () => {},
  add: () => {},
  set: () => {},
});

export const useLikedCount = () => useContext(LikedCountContext);
