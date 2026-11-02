import type { ReactNode } from 'react';

export interface StatTileProps {
  label: ReactNode;
  value: ReactNode;
  background?: string;
  color?: string;
  isText?: boolean;
  order?: number;
}
