import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { paths } from '@/app/paths';
import { useAuth } from './useAuth';

// Componente para proteger rotas que necessitam de autenticação
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn() ? children : <Navigate to={paths.login} replace />;
};

// Componente para redirecionar usuários já logados
export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();

  return !isLoggedIn() ? children : <Navigate to={paths.home} replace />;
};
