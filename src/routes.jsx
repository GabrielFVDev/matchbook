import { Route, BrowserRouter, Routes } from 'react-router-dom';
import LoginPage from './pages/auth/login';
import CadastroPage from './pages/auth/cadastro';
import HomePage from './pages/home';
import ProfilePage from './pages/profile';
import MeusLivrosPage from './pages/meus-livros';
import AdicionarLivroPage from './pages/adicionar-livro';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { AppShell } from './components/AppShell';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/cadastro"
          element={
            <PublicRoute>
              <CadastroPage />
            </PublicRoute>
          }
        />
        {/* Telas de quem já entrou: dividem o mesmo cabeçalho e barra do celular */}
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="/meus-livros" element={<MeusLivrosPage />} />
          <Route path="/adicionar-livro" element={<AdicionarLivroPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
