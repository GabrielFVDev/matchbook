import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppProviders } from './AppProviders';
import { routes } from './router';

const router = createBrowserRouter(routes);

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
