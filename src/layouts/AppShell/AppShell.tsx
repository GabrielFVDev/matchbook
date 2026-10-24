import { useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import styled from 'styled-components';
import Header from '@/layouts/Header';
import { MobileNav } from '@/layouts/MobileNav';
import { ShellContext } from './shellContext';
import type { ShellAppearance } from './shellContext';
import { colors } from '@/styles/tokens';
import { screenTransition } from '@/styles/motion';

const Page = styled.div<{ $background: string }>`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ $background }) => $background};
  transition: background-color 0.5s ease;
`;

const Content = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// Fixed frame of the logged-in screens. Header and mobile bar stay
// mounted; only the route content changes, with an enter and exit animation.
export function AppShell() {
  const location = useLocation();
  const outlet = useOutlet();
  const [appearance, setAppearance] = useState<ShellAppearance>({
    background: colors.appBackground,
    accentColor: colors.brand,
  });

  return (
    <ShellContext.Provider value={setAppearance}>
      <Page $background={appearance.background}>
        <Header accentColor={appearance.accentColor} />
        <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
          <Content key={location.pathname} {...screenTransition}>
            {outlet}
          </Content>
        </AnimatePresence>
        <MobileNav />
      </Page>
    </ShellContext.Provider>
  );
}
