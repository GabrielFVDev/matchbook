import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { cores, celular } from '@/styles/tokens';
import { IconHeart } from '@/components/Icons';

const LogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  color: ${cores.tinta};
  text-decoration: none;
`;

const Marca = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: ${cores.tinta};
  color: ${cores.branco};

  ${celular} {
    width: 30px;
    height: 30px;
    border-radius: 9px;
  }
`;

const Nome = styled.span`
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;

  ${celular} {
    font-size: 20px;
  }
`;

export function Logo({ para = '/' }) {
  return (
    <LogoLink to={para} aria-label="Matchbook, página inicial">
      <Marca>
        <IconHeart tamanho={17} />
      </Marca>
      <Nome aria-hidden="true">matchbook</Nome>
    </LogoLink>
  );
}
