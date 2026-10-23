import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { cores, celular, raio, sombra } from '../../styles/tokens';

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
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 0 16px;
  border: 0;
  border-radius: ${raio.pilula};
  background: transparent;
  color: ${cores.tintaSuave};
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
`;

export const NavItem = styled(NavLink)`
  ${estiloItem}

  &[aria-current='page'] {
    padding: 0 18px;
    background: ${cores.branco};
    box-shadow: ${sombra.ativo};
    color: ${cores.tinta};
    font-weight: 700;
  }
`;

export const LogoutButton = styled.button.attrs({ type: 'button' })`
  ${estiloItem}
`;

export const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MobileOnly = styled.div`
  display: none;

  ${celular} {
    display: flex;
  }
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
