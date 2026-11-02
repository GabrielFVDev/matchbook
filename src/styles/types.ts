import type { MotionProps } from 'motion/react';
import type { genres } from './tokens';

export interface GenreColors {
  cover: string;
  background: string;
}

export type GenreName = keyof typeof genres;

// The enter and exit props that animated components receive spread, like {...cardEntrance}.
export type MotionAnimation = Pick<MotionProps, 'initial' | 'animate' | 'exit'>;
