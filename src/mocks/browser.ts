import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// The fake API in the browser, turned on only by "npm run dev:mock".
export const worker = setupWorker(...handlers);
