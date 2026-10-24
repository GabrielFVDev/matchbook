import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { colors, mobile, radius, shadow } from '@/styles/tokens';
import { spring } from '@/styles/motion';
import { IconHeartOutline, IconHome, IconPlus, IconUser } from '@/components/Icons';
import { paths } from '@/app/paths';

const Bar = styled.nav`
  display: none;

  ${mobile} {
    position: fixed;
    left: 16px;
    right: 16px;
    bottom: 14px;
    z-index: 20;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 4px;
    padding: 6px;
    border-radius: ${radius.pill};
    background: ${colors.white};
    box-shadow: ${shadow.floating};
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
  border-radius: ${radius.pill};
  color: ${colors.inkSoft};
  font-size: 11px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;

  &[aria-current='page'] {
    color: ${colors.white};
    font-weight: 700;
  }

  > svg,
  > span:last-child {
    position: relative;
  }
`;

// Dark background of the active tab. Slides between tabs when the screen changes.
const ActiveTab = styled(motion.span)`
  position: absolute;
  inset: 0;
  border-radius: ${radius.pill};
  background: ${colors.ink};
`;

const tabs = [
  { to: paths.home, label: 'Início', icon: <IconHome /> },
  { to: paths.myBooks, label: 'Meus livros', icon: <IconHeartOutline /> },
  { to: paths.addBook, label: 'Adicionar', icon: <IconPlus /> },
  { to: paths.profile, label: 'Perfil', icon: <IconUser /> },
];

// Mobile navigation bar. On mobile, "Sair" lives inside the Profile.
export function MobileNav() {
  return (
    <Bar aria-label="Principal">
      {tabs.map((tab) => (
        <Item key={tab.to} to={tab.to}>
          {({ isActive }) => (
            <>
              {isActive && <ActiveTab layoutId="activeTab" transition={spring} />}
              {tab.icon}
              <span>{tab.label}</span>
            </>
          )}
        </Item>
      ))}
    </Bar>
  );
}
