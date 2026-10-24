import { createContext, useContext } from 'react';

export interface LikedCountValue {
  // null enquanto o contador ainda não chegou da API.
  total: number | null;
  load: () => void;
  add: (amount: number) => void;
  set: (value: number | null) => void;
}

// Contador de livros curtidos mostrado no cabeçalho de todas as telas.
export const LikedCountContext = createContext<LikedCountValue>({
  total: null,
  load: () => {},
  add: () => {},
  set: () => {},
});

export const useLikedCount = () => useContext(LikedCountContext);
