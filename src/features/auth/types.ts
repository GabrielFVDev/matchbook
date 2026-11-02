import type { ReactNode } from 'react';

export interface RouteGuardProps {
  children: ReactNode;
}

export interface RedirectOnArrivalProps extends RouteGuardProps {
  loggedIn: boolean;
}
