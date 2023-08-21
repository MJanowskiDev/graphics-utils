'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

interface AuthContextProps {
  token: string | null;
  isLoggedIn: boolean;
  setToken: (token: string | null) => void;
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
  const [token, setTokenState] = useLocalStorage<string | null>('token', null);

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
  };

  const logOut = () => {
    setTokenState(null);
  };

  const value = {
    token,
    isLoggedIn: Boolean(token),
    setToken,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
