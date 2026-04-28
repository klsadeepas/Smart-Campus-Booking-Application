// ProtectedRoute — guards routes based on authentication and user role
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../utils/constants";

/**
 * @param {string[]} allowedRoles - if empty/undefined, any authenticated user can pass
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  // Not logged in → redirect to login, preserving the attempted URL
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Role check — if specific roles are required
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
