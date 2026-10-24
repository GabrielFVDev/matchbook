import type { BezierDefinition, MotionProps, Transition } from 'motion/react';

// App curves and transitions. Short, purposeful motion: enter softly, leave fast.

export const enterEase = [0.22, 1, 0.36, 1] satisfies BezierDefinition;
export const exitEase = [0.4, 0, 1, 1] satisfies BezierDefinition;

export const spring = { type: 'spring', stiffness: 380, damping: 32 } satisfies Transition;
export const softSpring = { type: 'spring', stiffness: 260, damping: 26 } satisfies Transition;

// The enter and exit props that animated components receive spread, like {...cardEntrance}.
type MotionAnimation = Pick<MotionProps, 'initial' | 'animate' | 'exit'>;

// Screen change: the new content rises a little as it enters and the old one goes away fast.
export const screenTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: enterEase } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: exitEase } },
} satisfies MotionAnimation;

// Staggered entrance: each block shows up a little after the previous one.
export const appear = (order = 0): MotionAnimation => ({
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: enterEase, delay: Math.min(order * 0.06, 0.36) },
  },
});

// Main card of login and sign-up: rises after the rest of the screen.
export const cardEntrance = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: enterEase, delay: 0.1 } },
} satisfies MotionAnimation;

// Notices: enter with a spring and leave fast. The caller wraps the notice in AnimatePresence.
export const toastAnimation = {
  initial: { opacity: 0, y: 16, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 420, damping: 30 },
  },
  exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.15, ease: exitEase } },
} satisfies MotionAnimation;
