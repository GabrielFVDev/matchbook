import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { LikedCountProvider } from '@/lib/LikedCountProvider';

// What wraps the whole app, outside the router. The tests use the same with a router of their own.
export function AppProviders({ children }: { children: ReactNode }) {
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
