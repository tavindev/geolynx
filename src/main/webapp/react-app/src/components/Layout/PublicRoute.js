import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (user) {
    // Redirect logged-in users from public pages to the main dashboard.
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default PublicRoute; 