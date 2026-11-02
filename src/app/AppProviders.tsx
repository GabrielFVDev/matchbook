import { MotionConfig } from 'motion/react';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { LikedCountProvider } from '@/lib/LikedCountProvider';
import type { AppProvidersProps } from './types';

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <MotionConfig reducedMotion="user">
      <LikedCountProvider>
        <GlobalStyle />
        {children}
      </LikedCountProvider>
    </MotionConfig>
  );
}
