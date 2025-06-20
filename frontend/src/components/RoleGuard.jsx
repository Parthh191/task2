import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/roles';

export const RoleGuard = ({ children, requiredPermission }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || !hasPermission(user.role, requiredPermission)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};