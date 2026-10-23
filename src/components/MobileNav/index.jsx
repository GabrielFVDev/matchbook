import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { cores, celular, raio, sombra } from '../../styles/tokens';
import { IconHeartOutline, IconHome, IconPlus, IconUser } from '../Icons';

const Barra = styled.nav`
  display: none;

  ${celular} {
    position: fixed;
    left: 16px;
    right: 16px;
    bottom: 14px;
    z-index: 20;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 4px;
    padding: 6px;
    border-radius: ${raio.pilula};
    background: ${cores.branco};
    box-shadow: ${sombra.flutuante};
  }
`;

const Item = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-height: 52px;
  border-radius: ${raio.pilula};
  color: ${cores.tintaSuave};
  font-size: 11px;
  font-weight: 500;
  text-decoration: none;

  &[aria-current='page'] {
    background: ${cores.tinta};
    color: ${cores.branco};
    font-weight: 700;
  }
`;

// Barra de navegação do celular. No celular o "Sair" fica dentro do Perfil.
export function MobileNav() {
  return (
    <Barra aria-label="Principal">
      <Item to="/home">
        <IconHome />
        Início
      </Item>
      <Item to="/meus-livros">
        <IconHeartOutline />
        Meus livros
      </Item>
      <Item to="/adicionar-livro">
        <IconPlus />
        Adicionar
      </Item>
      <Item to="/profile">
        <IconUser />
        Perfil
      </Item>
    </Barra>
  );
}
