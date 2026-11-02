import { Outlet } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from '@/features/auth/RouteGuards';
import { AppShell } from '@/layouts/AppShell';
import { paths } from './paths';
import type { ScreenModule } from './types';

const page = (load: () => Promise<ScreenModule>) => async () => ({
  Component: (await load()).default,
});

export const routes: RouteObject[] = [
  {
    HydrateFallback: () => null,
    children: [
      {
        element: (
          <PublicRoute>
            <Outlet />
          </PublicRoute>
        ),
        children: [
          { path: paths.welcome, lazy: page(() => import('@/features/welcome/WelcomePage')) },
          { path: paths.login, lazy: page(() => import('@/features/auth/LoginPage')) },
          { path: paths.signUp, lazy: page(() => import('@/features/auth/SignUpPage')) },
        ],
      },
      {
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
      { path: '*', lazy: page(() => import('@/features/not-found/NotFoundPage')) },
    ],
  },
];
