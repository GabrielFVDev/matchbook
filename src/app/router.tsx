import { Outlet } from 'react-router-dom';
import type { ComponentType } from 'react';
import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from '@/features/auth/RouteGuards';
import { AppShell } from '@/layouts/AppShell';
import { paths } from './paths';

// Cada tela vem num arquivo à parte, baixado quando a rota é aberta. O roteador espera o arquivo
// chegar antes de trocar de tela, então as transições do AppShell não ganham um "carregando".
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
});

export const routes: RouteObject[] = [
  {
    // Nada na tela enquanto o arquivo da primeira tela chega. Sem isto, o roteador avisa no console.
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
        // Telas de quem já entrou: dividem o mesmo cabeçalho e barra do celular.
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
      // Endereço desconhecido: tela vazia, como antes da troca de roteador. A 404 é o M8.
      { path: '*', Component: () => null },
    ],
  },
];
