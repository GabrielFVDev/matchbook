import { Route, BrowserRouter, Routes } from 'react-router-dom';
import LoginPage from '@/features/auth/LoginPage';
import SignUpPage from '@/features/auth/SignUpPage';
import HomePage from '@/features/recommendations/HomePage';
import ProfilePage from '@/features/profile/ProfilePage';
import MyBooksPage from '@/features/my-books/MyBooksPage';
import AddBookPage from '@/features/add-book/AddBookPage';
import { ProtectedRoute, PublicRoute } from '@/features/auth/RouteGuards';
import { AppShell } from '@/layouts/AppShell';
import { paths } from './paths';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={paths.login}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path={paths.signUp}
          element={
            <PublicRoute>
              <SignUpPage />
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
          <Route path={paths.home} element={<HomePage />} />
          <Route path={paths.myBooks} element={<MyBooksPage />} />
          <Route path={paths.addBook} element={<AddBookPage />} />
          <Route path={paths.profile} element={<ProfilePage />} />
        </Route>
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
