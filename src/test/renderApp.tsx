import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/app/App';
import { sessionUser } from '@/mocks/data';
import { server } from '@/mocks/server';

interface RenderAppOptions {
  // Grava a usuária de exemplo no localStorage, como se ela já tivesse entrado.
  loggedIn?: boolean;
}

// Abre o app inteiro num endereço, como quem digita a URL na barra.
export function renderApp(url: string, { loggedIn = false }: RenderAppOptions = {}) {
  if (loggedIn) localStorage.setItem('usuario', JSON.stringify(sessionUser));
  window.history.pushState({}, '', url);
  const user = userEvent.setup();
  return { user, ...render(<App />) };
}

export interface ApiCall {
  method: string;
  // Sem o "/api" do começo: "/livros-curtidos/curtir".
  path: string;
  search: string;
  body?: unknown;
}

// Anota, na ordem em que chegam, os pedidos feitos à API falsa.
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

// Os pedidos que mudam algo no servidor, como "POST /livro/create".
export const changes = (calls: ApiCall[]) =>
  calls
    .filter((call) => call.method !== 'GET')
    .map((call) => `${call.method} ${call.path}${call.search}`);
