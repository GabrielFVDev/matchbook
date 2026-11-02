import type { GenreName } from '@/styles/types';

// Each measure comes in a pair: [desktop, mobile].
export type Pair = readonly [number, number];

export interface StackCoverSpec {
  title: string;
  genre: GenreName;
  x: Pair;
  y: Pair;
  w: Pair;
  h: Pair;
  tilt: number;
  spread: number;
  fontSize: Pair;
  mobileTitle: boolean;
}
