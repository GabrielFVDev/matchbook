import type { BezierDefinition, MotionProps, Transition } from 'motion/react';

// Curvas e transições do app. Movimento curto, com propósito: entrar suave, sair rápido.

export const enterEase = [0.22, 1, 0.36, 1] satisfies BezierDefinition;
export const exitEase = [0.4, 0, 1, 1] satisfies BezierDefinition;

export const spring = { type: 'spring', stiffness: 380, damping: 32 } satisfies Transition;
export const softSpring = { type: 'spring', stiffness: 260, damping: 26 } satisfies Transition;

// As props de entrada e saída que os componentes animados recebem espalhadas, como {...cardEntrance}.
type MotionAnimation = Pick<MotionProps, 'initial' | 'animate' | 'exit'>;

// Troca de tela: o conteúdo novo sobe um pouco ao entrar e o antigo some rápido.
export const screenTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: enterEase } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: exitEase } },
} satisfies MotionAnimation;

// Entrada em sequência: cada bloco aparece um pouco depois do anterior.
export const appear = (order = 0): MotionAnimation => ({
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: enterEase, delay: Math.min(order * 0.06, 0.36) },
  },
});

// Cartão principal de login e cadastro: sobe depois do resto da tela.
export const cardEntrance = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: enterEase, delay: 0.1 } },
} satisfies MotionAnimation;

// Avisos: entram com mola e saem rápido. Quem mostra o aviso envolve em AnimatePresence.
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
