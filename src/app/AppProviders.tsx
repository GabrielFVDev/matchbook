import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { LikedCountProvider } from '@/lib/LikedCountProvider';

// O que envolve o app inteiro, por fora do roteador. Os testes usam o mesmo com um roteador próprio.
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    // reducedMotion="user": quem pediu menos movimento no sistema não vê deslocamentos.
    <MotionConfig reducedMotion="user">
      <LikedCountProvider>
        <GlobalStyle />
        {children}
      </LikedCountProvider>
    </MotionConfig>
  );
}
