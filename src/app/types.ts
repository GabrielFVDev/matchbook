import type { ComponentType, ReactNode } from 'react';

export interface AppProvidersProps {
  children: ReactNode;
}

export interface ScreenModule {
  default: ComponentType;
}
