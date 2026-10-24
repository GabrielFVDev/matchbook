import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// A API falsa nos testes (Node).
export const server = setupServer(...handlers);
