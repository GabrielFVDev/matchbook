import { createContext, useContext } from 'react';
import type { LikedCountValue } from '@/lib/types';

export const LikedCountContext = createContext<LikedCountValue>({
  total: null,
  load: () => {},
  add: () => {},
  set: () => {},
});

export const useLikedCount = () => useContext(LikedCountContext);
