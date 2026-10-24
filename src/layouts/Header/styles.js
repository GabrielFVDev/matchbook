import styled from 'styled-components';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { cores, celular, raio, sombra } from '@/styles/tokens';

export const HeaderContainer = styled.header`
  width: 100%;
`;

export const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  ${celular} {
    padding: 12px 20px;
    gap: 12px;
  }
`;

export const NavigationContainer = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;

  ${celular} {
    display: none;
  }
`;

const estiloItem = `
  position: relative;
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 0 17px;
  border: 0;
  border-radius: ${raio.pilula};
  background: transparent;
  color: ${cores.tintaSuave};
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
`;

export const NavItem = styled(NavLink)`
  ${estiloItem}

  &:hover {
    color: ${cores.tinta};
  }

  &[aria-current='page'] {
    color: ${cores.tinta};
    font-weight: 700;
  }
`;

// Fundo branco do item ativo. Desliza entre os itens ao trocar de tela.
export const ActivePill = styled(motion.span)`
  position: absolute;
  inset: 0;
  border-radius: ${raio.pilula};
  background: ${cores.branco};
  box-shadow: ${sombra.ativo};
`;

export const NavLabel = styled.span`
  position: relative;
`;

export const LogoutButton = styled.button.attrs({ type: 'button' })`
  ${estiloItem}

  &:hover {
    color: ${cores.tinta};
  }
`;

export const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MobileAction = styled(motion.div)`
  display: none;

  ${celular} {
    display: flex;
  }
`;

export const MobileIconLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: ${raio.pilula};
  background: ${cores.branco};
  color: ${cores.tinta};
`;

export const Counter = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 16px;
  border-radius: ${raio.pilula};
  background: ${cores.branco};
  font-size: 14px;

  strong {
    display: inline-block;
    font-weight: 800;
  }

  svg {
    color: ${({ $cor }) => $cor};
    transition: color 0.4s ease;
  }

  ${celular} {
    min-height: 36px;
    padding: 0 14px;
    font-size: 13px;
  }
`;

export const CounterHeart = styled(motion.span)`
  display: flex;
`;

export const CounterNumber = styled(motion.strong)``;
