import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { MotionGlobalConfig } from 'motion/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { resetMockState } from '@/mocks/handlers';
import { server } from '@/mocks/server';

// Animations finish instantly, so assertions do not wait for exits and springs.
MotionGlobalConfig.skipAnimations = true;

// jsdom has no scrollTo (used in AppShell and Add book) nor matchMedia (used by motion).
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

// Any request without an answer in the fake API fails the test.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
  server.events.removeAllListeners();
  resetMockState();
  localStorage.clear();
});

afterAll(() => server.close());
