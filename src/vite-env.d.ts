/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Endereço da API; sem ele, vale o padrão de src/lib/env.ts.
  readonly VITE_API_URL?: string;
  // Definido pelo .env.mock ("npm run dev:mock"); quem liga a API falsa é o MODE "mock".
  readonly VITE_API_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
