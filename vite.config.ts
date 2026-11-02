/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const src = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: [
      ...(mode === 'test' || mode === 'mock'
        ? [{ find: '@/lib/firebase', replacement: src('mocks/firebase.ts') }]
        : []),
      { find: '@', replacement: src('') },
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: { firebase: ['firebase/app', 'firebase/auth'] },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
}));
