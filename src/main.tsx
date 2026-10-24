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

// No modo mock ("npm run dev:mock") a API falsa liga antes do app. Fora dele, o build
// troca MODE por "production" e o import da API falsa some do pacote final.
if (import.meta.env.MODE === 'mock') {
  import('@/mocks/browser')
    .then(({ worker }) => worker.start({ onUnhandledRequest: 'bypass' }))
    .then(renderApp);
} else {
  renderApp();
}
