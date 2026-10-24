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
import { useCurtidos } from '@/lib/likedCount';
import { clearSessionUser } from '@/lib/session';
import { paths } from '@/app/paths';
import { cores } from '@/styles/tokens';
import { mola } from '@/styles/motion';

const links = [
  { to: paths.home, label: 'Início' },
  { to: paths.myBooks, label: 'Meus livros' },
  { to: paths.addBook, label: 'Adicionar livro' },
  { to: paths.profile, label: 'Perfil' },
];

// Botão do canto direito no celular, que muda conforme a tela.
const acoesCelular: Record<string, { to: string; label: string; icone: ReactNode }> = {
  [paths.myBooks]: { to: paths.addBook, label: 'Adicionar livro', icone: <IconPlus /> },
  [paths.profile]: {
    to: `${paths.profile}?editar=1`,
    label: 'Editar perfil',
    icone: <IconPencil tamanho={18} />,
  },
};

export default function Header({ corDestaque = cores.marca }: { corDestaque?: string }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { total, carregar } = useCurtidos();
  const totalAnterior = useRef(total);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Só pulsa quando o número muda depois de carregado, não na primeira vez.
  const pulsar = totalAnterior.current !== null && totalAnterior.current !== total;
  useEffect(() => {
    totalAnterior.current = total;
  }, [total]);

  const handleLogout = () => {
    clearSessionUser();
    navigate(paths.login);
  };

  const acao = acoesCelular[pathname];

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo para={paths.home} />
        <NavigationContainer aria-label="Principal">
          {links.map((link) => (
            <NavItem key={link.to} to={link.to}>
              {({ isActive }) => (
                <>
                  {isActive && <ActivePill layoutId="navAtivo" transition={mola} />}
                  <NavLabel>{link.label}</NavLabel>
                </>
              )}
            </NavItem>
          ))}
          <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
        </NavigationContainer>
        <RightSide>
          <AnimatePresence mode="popLayout" initial={false}>
            {acao && (
              <MobileAction
                key={pathname}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={mola}
              >
                <MobileIconLink to={acao.to} aria-label={acao.label}>
                  {acao.icone}
                </MobileIconLink>
              </MobileAction>
            )}
          </AnimatePresence>
          {total !== null && (
            <Counter $cor={corDestaque}>
              <CounterHeart
                key={`coracao${total}`}
                initial={pulsar ? { scale: 1.5 } : false}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 14 }}
              >
                <IconHeart tamanho={15} />
              </CounterHeart>
              <span>
                <CounterNumber
                  key={total}
                  initial={pulsar ? { y: -8, opacity: 0 } : false}
                  animate={{ y: 0, opacity: 1 }}
                  transition={mola}
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
