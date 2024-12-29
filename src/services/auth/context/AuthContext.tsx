import React, { createContext, useCallback, useMemo } from 'react';
import { User } from '../../../types/auth';
import { AuthContextInterface } from '../types/authTypes';
import { useAuthState } from '../hooks/useAuthState';
import { useUserData } from '../hooks/useUserData';

export const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { auth, setAuth } = useAuthState();
  const { updateUserData } = useUserData(auth, setAuth);

  const login = useCallback((token: string, user: User) => {
    setAuth({
      isAuthenticated: true,
      user,
      authToken: token,
    });
  }, [setAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth');
    setAuth({
      isAuthenticated: false,
      user: null,
      authToken: null,
    });
  }, [setAuth]);

  const contextValue = useMemo(() => ({
    ...auth,
    login,
    logout,
    updateUserData
  }), [auth, login, logout, updateUserData]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
