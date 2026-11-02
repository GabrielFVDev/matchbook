import '@testing-library/jest-dom/vitest';
import { cleanup, configure } from '@testing-library/react';
import { MotionGlobalConfig } from 'motion/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { resetMockState } from '@/mocks/handlers';
import { server } from '@/mocks/server';

configure({ asyncUtilTimeout: 3000 });

MotionGlobalConfig.skipAnimations = true;

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

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
  server.events.removeAllListeners();
  resetMockState();
  localStorage.clear();
});

afterAll(() => server.close());
