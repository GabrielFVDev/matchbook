/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const src = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: [
      // The tests and "npm run dev:mock" log in without Firebase: the account lives in memory.
      ...(mode === 'test' || mode === 'mock'
        ? [{ find: '@/lib/firebase', replacement: src('mocks/firebase.ts') }]
        : []),
      { find: '@', replacement: src('') },
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
}));
