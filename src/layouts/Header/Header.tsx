import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import {
  HeaderContainer,
  HeaderContent,
  NavigationContainer,
  NavItem,
  ActivePill,
  NavLabel,
  LogoutButton,
  RightSide,
  MobileAction,
  MobileIconLink,
  Counter,
  CounterHeart,
  CounterNumber,
} from './styles';
import { Logo } from '@/components/Logo';
import { IconHeart, IconPencil, IconPlus } from '@/components/Icons';
import { useLikedCount } from '@/lib/likedCount';
import { clearSessionUser } from '@/lib/session';
import { paths } from '@/app/paths';
import { colors } from '@/styles/tokens';
import { spring } from '@/styles/motion';

const links = [
  { to: paths.home, label: 'Início' },
  { to: paths.myBooks, label: 'Meus livros' },
  { to: paths.addBook, label: 'Adicionar livro' },
  { to: paths.profile, label: 'Perfil' },
];

// Button in the right corner on mobile, which changes with the screen.
const mobileActions: Record<string, { to: string; label: string; icon: ReactNode }> = {
  [paths.myBooks]: { to: paths.addBook, label: 'Adicionar livro', icon: <IconPlus /> },
  [paths.profile]: {
    to: `${paths.profile}?editar=1`,
    label: 'Editar perfil',
    icon: <IconPencil size={18} />,
  },
};

export default function Header({ accentColor = colors.brand }: { accentColor?: string }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { total, load } = useLikedCount();
  const previousTotal = useRef(total);

  useEffect(() => {
    load();
  }, [load]);

  // Only pulses when the number changes after loading, not the first time.
  const pulse = previousTotal.current !== null && previousTotal.current !== total;
  useEffect(() => {
    previousTotal.current = total;
  }, [total]);

  const handleLogout = () => {
    clearSessionUser();
    navigate(paths.login);
  };

  const action = mobileActions[pathname];

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to={paths.home} />
        <NavigationContainer aria-label="Principal">
          {links.map((link) => (
            <NavItem key={link.to} to={link.to}>
              {({ isActive }) => (
                <>
                  {isActive && <ActivePill layoutId="activeNav" transition={spring} />}
                  <NavLabel>{link.label}</NavLabel>
                </>
              )}
            </NavItem>
          ))}
          <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
        </NavigationContainer>
        <RightSide>
          <AnimatePresence mode="popLayout" initial={false}>
            {action && (
              <MobileAction
                key={pathname}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={spring}
              >
                <MobileIconLink to={action.to} aria-label={action.label}>
                  {action.icon}
                </MobileIconLink>
              </MobileAction>
            )}
          </AnimatePresence>
          {total !== null && (
            <Counter $color={accentColor}>
              <CounterHeart
                key={`heart${total}`}
                initial={pulse ? { scale: 1.5 } : false}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 14 }}
              >
                <IconHeart size={15} />
              </CounterHeart>
              <span>
                <CounterNumber
                  key={total}
                  initial={pulse ? { y: -8, opacity: 0 } : false}
                  animate={{ y: 0, opacity: 1 }}
                  transition={spring}
                >
                  {total}
                </CounterNumber>{' '}
                curtidos
              </span>
            </Counter>
          )}
        </RightSide>
      </HeaderContent>
    </HeaderContainer>
  );
}
