import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/app/AppProviders';
import { routes } from '@/app/router';
import { sessionUser } from '@/mocks/data';
import { server } from '@/mocks/server';

interface RenderAppOptions {
  // Stores the sample user in localStorage, as if she had already logged in.
  loggedIn?: boolean;
}

let router: ReturnType<typeof createBrowserRouter> | null = null;

// Opens the whole app at an address, like typing the URL in the bar. Each test gets a new router,
// which reads the address that was just put in the bar. The first screen arrives on demand:
// look for its first element with findBy, not getBy.
export function renderApp(url: string, { loggedIn = false }: RenderAppOptions = {}) {
  if (loggedIn) localStorage.setItem('usuario', JSON.stringify(sessionUser));
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

export interface ApiCall {
  method: string;
  // Without the leading "/api": "/livros-curtidos/curtir".
  path: string;
  search: string;
  body?: unknown;
}

// Records the requests made to the fake API, in the order they arrive.
export function trackApiCalls() {
  const calls: ApiCall[] = [];
  server.events.on('request:start', ({ request }) => {
    const url = new URL(request.url);
    const call: ApiCall = {
      method: request.method,
      path: url.pathname.replace(/^\/api/, ''),
      search: url.search,
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

// The requests that change something on the server, like "POST /livro/create".
export const changes = (calls: ApiCall[]) =>
  calls
    .filter((call) => call.method !== 'GET')
    .map((call) => `${call.method} ${call.path}${call.search}`);
