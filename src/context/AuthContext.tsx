import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  isAdmin: boolean;
  isTeacher: boolean;
  isSuperAdmin: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('quizy_user') : null;
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Storage read restricted or unavailable:', e);
    }
    return null;
  });

  const login = (newUser: AuthUser) => {
    setUser(newUser);
    try {
      localStorage.setItem('quizy_user', JSON.stringify(newUser));
    } catch (e) {
      console.warn('Storage write restricted or unavailable:', e);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('quizy_user');
    } catch (e) {
      console.warn('Storage remove restricted or unavailable:', e);
    }
  };

  const role = user?.role;
  const isSuperAdmin = role === 'superadmin';
  const isTeacher = role === 'teacher' || role === 'admin';
  const isAdmin = isTeacher || isSuperAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin,
        isTeacher,
        isSuperAdmin,
        isLoggedIn: !!user,
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
