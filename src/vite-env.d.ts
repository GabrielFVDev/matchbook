/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API address; without it, the default in src/lib/env.ts applies.
  readonly VITE_API_URL?: string;
  // Set by .env.mock ("npm run dev:mock"); what turns the fake API on is the "mock" MODE.
  readonly VITE_API_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
