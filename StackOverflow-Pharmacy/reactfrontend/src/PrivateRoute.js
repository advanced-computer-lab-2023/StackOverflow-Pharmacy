import React from 'react';
import { Navigate, Route } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  // Check if the user is authenticated (you can implement your own logic here)
  const isAuthenticated = localStorage.getItem('authToken') ? true : false;

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
