import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute: React.FC = () => {
  const { username } = useAuth();

  if (username === null) {
    return <Navigate to="/" replace />;
  }
  else {
    return <Outlet />;
  }
  
};

export default PrivateRoute;
