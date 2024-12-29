import { useState, useEffect, useCallback } from 'react';
import { AuthState } from '../../../types/auth';

export function useAuthState() {
  const [auth, setAuth] = useState<AuthState>(() => {
    const savedAuth = localStorage.getItem('auth');
    return savedAuth ? JSON.parse(savedAuth) : {
      isAuthenticated: false,
      user: null,
      authToken: null,
    };
  });

  const updateAuth = useCallback((newAuth: AuthState) => {
    setAuth(newAuth);
    localStorage.setItem('auth', JSON.stringify(newAuth));
  }, []);

  return { auth, setAuth: updateAuth };
}
