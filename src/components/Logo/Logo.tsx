import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { colors, mobile } from '@/styles/tokens';
import { IconHeart } from '@/components/Icons';

const LogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  color: ${colors.ink};
  text-decoration: none;
`;

const Mark = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: ${colors.ink};
  color: ${colors.white};

  ${mobile} {
    width: 30px;
    height: 30px;
    border-radius: 9px;
  }
`;

const Wordmark = styled.span`
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;

  ${mobile} {
    font-size: 20px;
  }
`;

export function Logo({ to = '/' }: { to?: string }) {
  return (
    <LogoLink to={to} aria-label="Matchbook, página inicial">
      <Mark>
        <IconHeart size={17} />
      </Mark>
      <Wordmark aria-hidden="true">matchbook</Wordmark>
    </LogoLink>
  );
}
