import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

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
    // Check if user is logged in by fetching current user info
    const checkLoggedIn = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response.data) {
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // If it fails with 401, user is not logged in
        if (error.response?.status === 401) {
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      // Backend returns 204 No Content with session cookie
      await authService.login({ email, password });

      // Fetch user info after successful login
      const userResponse = await authService.getCurrentUser();
      setUser(userResponse.data);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      let errorMessage = 'Credenciais inválidas';

      // Check for specific error messages from backend
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 403) {
        errorMessage = 'Conta suspensa. Não é possível fazer login.';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const register = async (userData) => {
    try {
      await authService.register(userData);
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
      await authService.logout();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false;
    return user.role === requiredRole;
  };

  const hasAnyRole = (roles) => {
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  };

  const hasPermission = (permission) => {
    // Implement permission checking based on role
    const rolePermissions = {
      ADMIN: ['all'],
      SYSADMIN: ['all'],
      SMBO: ['manage_worksheets', 'manage_users', 'view_all'],
      SGVBO: ['view_worksheets', 'generate_reports'],
      SDVBO: ['edit_operations', 'export_execution_sheets', 'view_analytics'],
      PRBO: [
        'create_execution_sheet',
        'assign_operations',
        'view_global_status',
      ],
      PO: ['start_activity', 'stop_activity', 'view_assigned_operations'],
      OPERATOR: ['view_assigned_work', 'update_progress'],
      PARTNER: ['view_public_data'],
    };

    if (!user || !user.role) return false;

    // Admin roles have all permissions
    if (user.role === 'ADMIN' || user.role === 'SYSADMIN') return true;

    const permissions = rolePermissions[user.role] || [];
    return permissions.includes(permission) || permissions.includes('all');
  };

  const value = {
    user,
    setUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    hasRole,
    hasAnyRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
