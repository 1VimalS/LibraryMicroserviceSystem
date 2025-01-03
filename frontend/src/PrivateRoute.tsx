import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute: React.FC = () => {
  const { username } = useAuth();

  if (!username) {
    return <Navigate to="/" replace />;
  }
  else {
    console.log("PrivateRoute: username is " + username);
    return <Outlet />;
  }
  
};

export default PrivateRoute;
