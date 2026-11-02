import type { ReactNode } from 'react';

export interface AuthLayoutProps {
  topLink?: ReactNode;
  align?: string;
  children: ReactNode;
}
