import { MotionConfig } from 'motion/react';
import AppRoutes from './router';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { CurtidosProvider } from '@/lib/LikedCountProvider';

function App() {
  return (
    // reducedMotion="user": quem pediu menos movimento no sistema não vê deslocamentos.
    <MotionConfig reducedMotion="user">
      <CurtidosProvider>
        <GlobalStyle />
        <AppRoutes />
      </CurtidosProvider>
    </MotionConfig>
  );
}

export default App;
