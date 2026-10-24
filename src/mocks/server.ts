import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// The fake API in the tests (Node).
export const server = setupServer(...handlers);
