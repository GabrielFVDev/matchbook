import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { paths } from '@/app/paths';
import { useAuth } from './useAuth';

// Protects routes that require authentication
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn() ? children : <Navigate to={paths.login} replace />;
};

// Redirects users who are already logged in
export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();

  return !isLoggedIn() ? children : <Navigate to={paths.home} replace />;
};
