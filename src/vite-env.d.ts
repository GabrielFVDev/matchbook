/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API address; without it, the default in src/lib/env.ts applies.
  readonly VITE_API_URL?: string;
  // Set by .env.mock ("npm run dev:mock"); what turns the fake API on is the "mock" MODE.
  readonly VITE_API_MOCK?: string;
  // The firebaseConfig of the web app, in .env.local. The tests and "dev:mock" do not read them.
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
