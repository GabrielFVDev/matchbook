import { createContext, useContext } from 'react';

export interface LikedCountValue {
  // null while the counter has not arrived from the API yet.
  total: number | null;
  load: () => void;
  add: (amount: number) => void;
  set: (value: number | null) => void;
}

// Counter of liked books shown in the header of every screen.
export const LikedCountContext = createContext<LikedCountValue>({
  total: null,
  load: () => {},
  add: () => {},
  set: () => {},
});

export const useLikedCount = () => useContext(LikedCountContext);
