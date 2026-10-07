import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../constants/routeConstants';
import { useAuth } from '../hooks/useAuth';

export const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};
