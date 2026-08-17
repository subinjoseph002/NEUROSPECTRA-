import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('neuro_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('neuro_access_token');
      if (token && !user) {
        try {
          const profile = await authApi.getProfile();
          setUser(profile);
          localStorage.setItem('neuro_user', JSON.stringify(profile));
        } catch (err) {
          localStorage.removeItem('neuro_access_token');
          localStorage.removeItem('neuro_refresh_token');
          localStorage.removeItem('neuro_user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const getDashboardPath = (role) => {
    switch (role) {
      case 'Administrator':
        return '/admin/dashboard';
      case 'Therapist':
        return '/therapist/dashboard';
      case 'Receptionist':
        return '/receptionist/dashboard';
      case 'Parent / Caregiver':
        return '/parent/dashboard';
      case 'Teacher':
        return '/teacher/dashboard';
      default:
        return '/parent/dashboard';
    }
  };

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    localStorage.setItem('neuro_access_token', data.access);
    localStorage.setItem('neuro_refresh_token', data.refresh);
    localStorage.setItem('neuro_user', JSON.stringify(data.user));
    setUser(data.user);
    const targetDashboard = getDashboardPath(data.user.role);
    navigate(targetDashboard);
    return data.user;
  };

  const register = async (userData) => {
    const data = await authApi.register(userData);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('neuro_access_token');
    localStorage.removeItem('neuro_refresh_token');
    localStorage.removeItem('neuro_user');
    setUser(null);
    navigate('/login');
  };

  const switchDemoRole = (role, demoUser) => {
    // Quick Demo Persona Switcher helper for evaluation
    const demoPayload = {
      id: demoUser.id || 'usr_demo',
      full_name: demoUser.full_name,
      email: demoUser.email,
      role: role,
      phone: '+91 9876543210',
      avatar_url: demoUser.avatar_url,
      is_active: 1,
    };
    localStorage.setItem('neuro_user', JSON.stringify(demoPayload));
    setUser(demoPayload);
    navigate(getDashboardPath(role));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        switchDemoRole,
        getDashboardPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
