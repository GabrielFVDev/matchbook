import type { ReactNode } from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';
import { colors, mobile, shadow } from '@/styles/tokens';
import { Logo } from '@/components/Logo';
import { paths } from '@/app/paths';

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${colors.brandBackground};
`;

const TopBar = styled.header`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 22px 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  ${mobile} {
    padding: 12px 20px;
  }
`;

const TopLinkText = styled.p`
  font-size: 15px;
  color: ${colors.inkSoft};
`;

const Main = styled.main<{ $align: string }>`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 40px 64px;
  display: flex;
  flex-wrap: wrap;
  align-items: ${({ $align }) => $align};
  justify-content: center;
  gap: 96px;

  ${mobile} {
    align-content: flex-start;
    padding: 4px 20px 32px;
    gap: 20px;
  }
`;

// Login and sign-up frame: brand background, logo at the top and two columns.
interface AuthLayoutProps {
  topLink?: ReactNode;
  align?: string;
  children: ReactNode;
}

export function AuthLayout({ topLink, align = 'center', children }: AuthLayoutProps) {
  return (
    <Page>
      <TopBar>
        <Logo to={paths.welcome} />
        {topLink && <TopLinkText>{topLink}</TopLinkText>}
      </TopBar>
      <Main $align={align}>{children}</Main>
    </Page>
  );
}

export const AuthSide = styled(motion.div)`
  flex: 1 1 380px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;

  ${mobile} {
    flex-basis: auto;
    gap: 16px;
  }
`;

export const AuthCard = styled(motion.section)<{ $width?: number }>`
  flex: 0 1 ${({ $width = 440 }) => $width}px;
  min-width: 0;
  padding: 40px;
  border-radius: 28px;
  background: ${colors.white};
  box-shadow: ${shadow.card};
  display: flex;
  flex-direction: column;
  gap: 28px;

  ${mobile} {
    flex-basis: 100%;
    padding: 28px 22px;
    border-radius: 26px;
    gap: 22px;
  }
`;

export const AuthHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const AuthEyebrow = styled.p<{ $brand?: boolean }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ $brand }) => ($brand ? colors.brand : colors.inkSoft)};
`;

export const AuthTitle = styled.h1`
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.02em;

  ${mobile} {
    font-size: 28px;
  }
`;

export const AuthText = styled.p`
  font-size: 16px;
  line-height: 1.45;
  color: ${colors.inkSoft};

  ${mobile} {
    font-size: 15px;
  }
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const AuthFooter = styled.p`
  font-size: 15px;
  color: ${colors.inkSoft};
  text-align: center;
`;
