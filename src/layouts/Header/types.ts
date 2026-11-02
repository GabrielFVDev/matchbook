import type { ReactNode } from 'react';

export interface HeaderAction {
  to: string;
  label: string;
  icon: ReactNode;
}

export interface HeaderProps {
  accentColor?: string;
}
