import { Outlet } from 'react-router-dom';
import type { ComponentType } from 'react';
import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from '@/features/auth/RouteGuards';
import { AppShell } from '@/layouts/AppShell';
import { paths } from './paths';

// Each screen comes in a separate file, downloaded when its route opens. The router waits for the
// file before switching screens, so the AppShell transitions do not get a "loading" state.
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
});

export const routes: RouteObject[] = [
  {
    // Blank while the first screen's file arrives. Without it, the router warns in the console.
    HydrateFallback: () => null,
    children: [
      {
        element: (
          <PublicRoute>
            <Outlet />
          </PublicRoute>
        ),
        children: [
          { path: paths.login, lazy: page(() => import('@/features/auth/LoginPage')) },
          { path: paths.signUp, lazy: page(() => import('@/features/auth/SignUpPage')) },
        ],
      },
      {
        // Screens of a logged-in user: they share the same header and mobile bar.
        element: (
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        ),
        children: [
          {
            path: paths.home,
            lazy: page(() => import('@/features/recommendations/HomePage')),
          },
          { path: paths.myBooks, lazy: page(() => import('@/features/my-books/MyBooksPage')) },
          { path: paths.addBook, lazy: page(() => import('@/features/add-book/AddBookPage')) },
          { path: paths.profile, lazy: page(() => import('@/features/profile/ProfilePage')) },
        ],
      },
      // Unknown address: empty screen, as before the router change. The 404 is M8.
      { path: '*', Component: () => null },
    ],
  },
];
