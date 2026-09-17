import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, ROLES } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';

const HOME_BY_ROLE = {
  [ROLES.COURIER]: ROUTES.COURIER_DASHBOARD,
  [ROLES.SUPERVISOR]: ROUTES.SUPERVISOR_DASHBOARD,
  [ROLES.HR]: ROUTES.HR_DASHBOARD,
};

/**
 * Route guard. Only renders its child routes when the logged-in role matches.
 * Any other role is redirected to its own home, so a supervisor can never land
 * on courier pages and vice versa.
 */
export default function RequireRole({ role }) {
  const { user } = useAuth();
  if (!user || user.role !== role) {
    return <Navigate to={(user && HOME_BY_ROLE[user.role]) || ROUTES.LOGIN} replace />;
  }
  return <Outlet />;
}
