import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/auth/hooks/useAuth';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
