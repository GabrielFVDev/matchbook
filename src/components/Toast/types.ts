import type { ReactNode } from 'react';

export type ToastTone = 'dark' | 'light';

export interface ToastProps {
  children: ReactNode;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
  tone?: ToastTone;
  duration?: number;
  onClose?: () => void;
  resetKey?: number | string;
}
