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

if (import.meta.env.MODE === 'mock') {
  import('@/mocks/browser')
    .then(({ worker }) => worker.start({ onUnhandledRequest: 'bypass' }))
    .then(renderApp);
} else {
  renderApp();
}
