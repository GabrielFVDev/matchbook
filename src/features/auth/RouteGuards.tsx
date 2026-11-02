import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { paths } from '@/app/paths';
import { useSession } from '@/lib/session';
import type { RedirectOnArrivalProps, RouteGuardProps } from './types';

// Protects routes that require authentication. Blank while Firebase restores the saved session,
// so whoever is logged in is not sent to the login for an instant when the page reloads.
export const ProtectedRoute = ({ children }: RouteGuardProps) => {
  const { status } = useSession();

  if (status === 'loading') return null;
  return status === 'loggedIn' ? children : <Navigate to={paths.login} replace />;
};

// Redirects to Home whoever arrives already logged in. Whoever logs in or creates an account here
// is taken on by the screen itself: Firebase logs the new account in before sign-up saves the taste.
// A new account on the login goes on to the sign-up under this same guard, with no new decision.
export const PublicRoute = ({ children }: RouteGuardProps) => {
  const { status } = useSession();

  if (status === 'loading') return null;
  return <RedirectOnArrival loggedIn={status === 'loggedIn'}>{children}</RedirectOnArrival>;
};

// Decides once, with the session of when the visitor arrived.
const RedirectOnArrival = ({ loggedIn, children }: RedirectOnArrivalProps) => {
  const [loggedInOnArrival] = useState(loggedIn);

  return loggedInOnArrival ? <Navigate to={paths.home} replace /> : children;
};
