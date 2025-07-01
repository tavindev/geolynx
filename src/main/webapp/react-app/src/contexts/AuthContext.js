import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Since there's no /user/me endpoint and authentication is cookie-based,
    // we'll check if the user has a session by trying to list users (which requires auth)
    // This is not ideal but works with the current backend
    const checkLoggedIn = async () => {
      try {
        // Try to make an authenticated request
        await api.post('/user/account-status', { identificador: 'test' });
        // If it succeeds, user is logged in
        setIsAuthenticated(true);
        // We don't have user data from backend, so we'll store it locally
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        // If it fails with 401, user is not logged in
        if (error.response?.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      // The login endpoint returns 204 No Content with a session cookie
      await api.post('/user/login', { email, password });

      // Store minimal user info locally since backend doesn't return it
      const userData = { username: email };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Credenciais inválidas',
      };
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/user/register', userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro no registo',
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/user/logout', {});
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const hasRole = (requiredRole) => {
    // Without user data from backend, we can't check roles
    // This would need to be implemented differently
    return true; // Allow all for now
  };

  const hasPermission = (permission) => {
    // Without user data from backend, we can't check permissions
    return true; // Allow all for now
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    hasRole,
    hasPermission,
    mockUsers: [],
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
