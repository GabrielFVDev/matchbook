import type { GenreName } from '@/styles/types';

export interface DemoBook {
  title: string;
  author: string;
  genre: GenreName;
  synopsis: string;
}

export type DemoChoice = 'love' | 'next';

export interface DemoState {
  index: number;
  answers: number;
  last: DemoChoice | null;
}

export interface AlgorithmStrategy {
  when: [string, string];
  name: string;
  text: [string, string];
  background: string;
  color: string;
}

export interface ShelfBook {
  title: string;
  genre: GenreName;
}

export interface PairProps {
  texts: [string, string];
}
