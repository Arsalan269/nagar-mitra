import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

export default function AdminProtectedRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <LoadingSpinner fullPage message="Checking permissions..." />;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return children;
}
