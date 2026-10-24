import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { cores, celular, raio, sombra } from '@/styles/tokens';
import { mola } from '@/styles/motion';
import { IconHeartOutline, IconHome, IconPlus, IconUser } from '@/components/Icons';
import { paths } from '@/app/paths';

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
  position: relative;
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
  transition: color 0.2s ease;

  &[aria-current='page'] {
    color: ${cores.branco};
    font-weight: 700;
  }

  > svg,
  > span:last-child {
    position: relative;
  }
`;

// Fundo escuro da aba ativa. Desliza entre as abas ao trocar de tela.
const AbaAtiva = styled(motion.span)`
  position: absolute;
  inset: 0;
  border-radius: ${raio.pilula};
  background: ${cores.tinta};
`;

const abas = [
  { to: paths.home, label: 'Início', icone: <IconHome /> },
  { to: paths.myBooks, label: 'Meus livros', icone: <IconHeartOutline /> },
  { to: paths.addBook, label: 'Adicionar', icone: <IconPlus /> },
  { to: paths.profile, label: 'Perfil', icone: <IconUser /> },
];

// Barra de navegação do celular. No celular o "Sair" fica dentro do Perfil.
export function MobileNav() {
  return (
    <Barra aria-label="Principal">
      {abas.map((aba) => (
        <Item key={aba.to} to={aba.to}>
          {({ isActive }) => (
            <>
              {isActive && <AbaAtiva layoutId="abaAtiva" transition={mola} />}
              {aba.icone}
              <span>{aba.label}</span>
            </>
          )}
        </Item>
      ))}
    </Barra>
  );
}
