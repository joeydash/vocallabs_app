import { useCallback, useEffect, useRef } from 'react';
import { AuthState } from '../types/authTypes';
import { authApi } from '../api/authApi';

export function useUserData(auth: AuthState, setAuth: (auth: AuthState) => void) {
  const dataFetchedRef = useRef(false);

  const updateUserData = useCallback(async () => {
    if (!auth.user?.id || !auth.authToken) return;

    try {
      const userData = await authApi.getUserData(auth.user.id, auth.authToken);
      if (userData) {
        setAuth({
          ...auth,
          user: {
            ...auth.user,
            fullname: userData.fullname || undefined,
            email: userData.email || undefined,
            dp: userData.dp || undefined,
          },
        });
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }, [auth, setAuth]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.id && !dataFetchedRef.current) {
      dataFetchedRef.current = true;
      updateUserData();
    }
    if (!auth.isAuthenticated) {
      dataFetchedRef.current = false;
    }
  }, [auth.isAuthenticated, auth.user?.id, updateUserData]);

  return { updateUserData };
}
