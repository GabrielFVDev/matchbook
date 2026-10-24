import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/app/App';

const renderApp = () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

// In mock mode ("npm run dev:mock") the fake API starts before the app. Outside it, the build
// replaces MODE with "production" and the fake API import drops out of the final bundle.
if (import.meta.env.MODE === 'mock') {
  import('@/mocks/browser')
    .then(({ worker }) => worker.start({ onUnhandledRequest: 'bypass' }))
    .then(renderApp);
} else {
  renderApp();
}
