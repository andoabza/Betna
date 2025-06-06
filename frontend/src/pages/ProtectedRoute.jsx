import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/userContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useUser();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  console.log(currentUser);
  return children;
};

export { ProtectedRoute };