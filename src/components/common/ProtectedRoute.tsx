import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {
  // Cek apakah ada token di local storage
  const token = localStorage.getItem('authToken');
  return token ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;