import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--teal)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  // Admin (stored as 'instructor') can access instructor routes
  const effectiveRole = user.role === 'instructor' ? 'instructor' : user.role;

  if (role && effectiveRole !== role) {
    return <Navigate to={effectiveRole === 'instructor' ? '/instructor/dashboard' : '/student/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;
