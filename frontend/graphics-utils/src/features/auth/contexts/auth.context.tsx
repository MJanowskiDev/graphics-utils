'use client';

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';

import { useCheckAuth } from '../hooks';

interface AuthContextProps {
  isLoggedIn: boolean;
  isLoading: boolean;
  logIn: () => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleSuccess = useCallback((isAuthenticated: boolean) => {
    setIsLoggedIn(isAuthenticated);
  }, []);

  const { isLoading } = useCheckAuth(handleSuccess);

  const logOut = () => {
    setIsLoggedIn(false);
  };

  const logIn = () => {
    setIsLoggedIn(true);
  };

  const value = {
    isLoggedIn,
    logIn,
    logOut,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
