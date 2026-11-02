import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { paths } from '@/app/paths';
import { useSession } from '@/lib/session';
import type { RedirectOnArrivalProps, RouteGuardProps } from './types';

export const ProtectedRoute = ({ children }: RouteGuardProps) => {
  const { status } = useSession();

  if (status === 'loading') return null;
  return status === 'loggedIn' ? children : <Navigate to={paths.login} replace />;
};

export const PublicRoute = ({ children }: RouteGuardProps) => {
  const { status } = useSession();

  if (status === 'loading') return null;
  return <RedirectOnArrival loggedIn={status === 'loggedIn'}>{children}</RedirectOnArrival>;
};

const RedirectOnArrival = ({ loggedIn, children }: RedirectOnArrivalProps) => {
  const [loggedInOnArrival] = useState(loggedIn);

  return loggedInOnArrival ? <Navigate to={paths.home} replace /> : children;
};
