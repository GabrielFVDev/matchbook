import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// A API falsa no navegador, ligada só pelo "npm run dev:mock".
export const worker = setupWorker(...handlers);
