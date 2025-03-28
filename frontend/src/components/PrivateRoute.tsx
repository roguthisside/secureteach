
import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '@/utils/auth';
import { toast } from 'sonner';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiresTeacher?: boolean;
  requiresStudent?: boolean;
}

const PrivateRoute = ({ 
  children, 
  requiresTeacher = false, 
  requiresStudent = false 
}: PrivateRouteProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();
  
  const isTeacher = authService.isTeacher();
  const isStudent = authService.isStudent();
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to access this page', {
        duration: 3000,
      });
      navigate('/login', { state: { from: location.pathname } });
    } else if (requiresTeacher && !isTeacher) {
      toast.error('Only teachers can access this page', {
        duration: 3000,
      });
      navigate('/dashboard');
    } else if (requiresStudent && !isStudent) {
      toast.error('Only students can access this page', {
        duration: 3000,
      });
      navigate('/dashboard');
    }
  }, [isAuthenticated, isTeacher, isStudent, requiresTeacher, requiresStudent, navigate, location.pathname]);
  
  if (!isAuthenticated) {
    // Redirect to login with return path
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  if (requiresTeacher && !isTeacher) {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (requiresStudent && !isStudent) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;
