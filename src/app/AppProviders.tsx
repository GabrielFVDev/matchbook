import { MotionConfig } from 'motion/react';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { LikedCountProvider } from '@/lib/LikedCountProvider';
import type { AppProvidersProps } from './types';

// What wraps the whole app, outside the router. The tests use the same with a router of their own.
export function AppProviders({ children }: AppProvidersProps) {
  return (
    // reducedMotion="user": whoever asked the system for less motion sees no movement.
    <MotionConfig reducedMotion="user">
      <LikedCountProvider>
        <GlobalStyle />
        {children}
      </LikedCountProvider>
    </MotionConfig>
  );
}
