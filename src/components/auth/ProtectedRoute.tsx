import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireAuth = true,
}) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: '12px',
        }}
      >
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>جاري التحقق من الجلسة...</span>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <>{children}</>;
  }

  if (allowedRoles && allowedRoles.length > 0 && user) {
    const hasRole = allowedRoles.includes(user.role);
    if (!hasRole) {
      return <>{children}</>;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
