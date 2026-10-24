import { MotionConfig } from 'motion/react';
import AppRoutes from './router';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { LikedCountProvider } from '@/lib/LikedCountProvider';

function App() {
  return (
    // reducedMotion="user": quem pediu menos movimento no sistema não vê deslocamentos.
    <MotionConfig reducedMotion="user">
      <LikedCountProvider>
        <GlobalStyle />
        <AppRoutes />
      </LikedCountProvider>
    </MotionConfig>
  );
}

export default App;
