
import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '@/utils/auth';
import { toast } from 'sonner';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to access this page', {
        duration: 3000,
      });
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    // Redirect to login with return path
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;
