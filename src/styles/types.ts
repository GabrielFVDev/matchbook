import type { MotionProps } from 'motion/react';
import type { genres } from './tokens';

export interface GenreColors {
  cover: string;
  background: string;
}

export type GenreName = keyof typeof genres;

export type MotionAnimation = Pick<MotionProps, 'initial' | 'animate' | 'exit'>;
