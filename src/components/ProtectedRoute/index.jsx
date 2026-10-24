import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Componente para proteger rotas que necessitam de autenticação
export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn() ? children : <Navigate to="/" replace />;
};

// Componente para redirecionar usuários já logados
export const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return !isLoggedIn() ? children : <Navigate to="/home" replace />;
};
