import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthResponse, Role, User } from '../types';
import { configureAxiosAuth } from '../lib/axios';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (authResponse: AuthResponse) => void;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  const login = useCallback((authResponse: AuthResponse) => {
    setAccessToken(authResponse.accessToken);
    setRefreshToken(authResponse.refreshToken);
    setUser({
      id: authResponse.userId,
      name: authResponse.name,
      email: authResponse.email,
      role: authResponse.role
    });
  }, []);

  const updateUser = useCallback((updated: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  }, []);

  const setTokens = useCallback((tokens: { accessToken: string; refreshToken: string }) => {
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
  }, []);

  // Configure Axios token provider dynamically
  useEffect(() => {
    configureAxiosAuth({
      getAccessToken: () => accessToken,
      getRefreshToken: () => refreshToken,
      onLogout: logout,
      onRefreshSuccess: (tokens) => {
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
      }
    });
  }, [accessToken, refreshToken, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        role: user?.role || null,
        isAuthenticated: !!accessToken && !!user,
        login,
        logout,
        updateUser,
        setTokens
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
