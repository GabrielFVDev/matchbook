import { useLayoutEffect } from 'react';
import styled from 'styled-components';
import { useSetShell } from '@/layouts/AppShell/shellContext';
import { colors, mobile } from '@/styles/tokens';
import type { AppLayoutProps } from './types';

const Main = styled.main<{ $gap: string }>`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 40px 64px;
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap};

  ${mobile} {
    padding: 4px 20px 112px;
    gap: 16px;
  }
`;

export function AppLayout({
  background = colors.appBackground,
  accentColor = colors.brand,
  gap = '28px',
  children,
}: AppLayoutProps) {
  const setShell = useSetShell();

  useLayoutEffect(() => {
    setShell({ background, accentColor });
  }, [setShell, background, accentColor]);

  return <Main $gap={gap}>{children}</Main>;
}
