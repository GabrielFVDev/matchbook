import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/app/AppProviders';
import { routes } from '@/app/router';
import { resetMockFirebase } from '@/mocks/firebase';
import { server } from '@/mocks/server';
import type { ApiCall, RenderAppOptions } from '@/test/types';

let router: ReturnType<typeof createBrowserRouter> | null = null;

export function renderApp(url: string, { loggedIn = false, photoUrl }: RenderAppOptions = {}) {
  resetMockFirebase({ loggedIn, photoUrl });
  window.history.pushState({}, '', url);
  router?.dispose();
  router = createBrowserRouter(routes);
  const user = userEvent.setup();
  return {
    user,
    ...render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>,
    ),
  };
}

export function trackApiCalls() {
  const calls: ApiCall[] = [];
  server.events.on('request:start', ({ request }) => {
    const url = new URL(request.url);
    const call: ApiCall = {
      method: request.method,
      path: url.pathname.replace(/^\/api/, ''),
      search: url.search,
      authorization: request.headers.get('Authorization'),
    };
    calls.push(call);
    void request
      .clone()
      .text()
      .then((text) => {
        if (text) call.body = JSON.parse(text);
      });
  });
  return calls;
}

export const changes = (calls: ApiCall[]) =>
  calls
    .filter((call) => call.method !== 'GET')
    .map((call) => `${call.method} ${call.path}${call.search}`);
