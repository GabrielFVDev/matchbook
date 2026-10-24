import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { MotionGlobalConfig } from 'motion/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { resetMockState } from '@/mocks/handlers';
import { server } from '@/mocks/server';

// As animações terminam na hora, para as asserções não esperarem saídas e molas.
MotionGlobalConfig.skipAnimations = true;

// O jsdom não tem scrollTo (usado no AppShell e em Adicionar livro) nem matchMedia (usado pelo motion).
window.scrollTo = () => {};
window.matchMedia = (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;

// Qualquer pedido sem resposta na API falsa derruba o teste.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
  server.events.removeAllListeners();
  resetMockState();
  localStorage.clear();
});

afterAll(() => server.close());
