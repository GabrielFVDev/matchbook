import type { AriaRole, ReactNode } from 'react';

export type Tone = 'brand' | 'error' | 'success';

export interface EmptyStateProps {
  icon?: ReactNode;
  tone?: Tone;
  title: ReactNode;
  description?: ReactNode;
  background?: string;
  children?: ReactNode;
  role?: AriaRole;
}
