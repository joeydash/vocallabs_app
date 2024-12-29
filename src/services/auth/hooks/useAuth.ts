import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useAnalytics } from '../../../hooks/useAnalytics';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { setUserId, setUserData } = useAnalytics();

  useEffect(() => {
    if (context?.user) {
      // Set user ID in Clarity
      setUserId(context.user.id);
      
      // Set user properties
      setUserData({
        phone: context.user.phone,
        fullname: context.user.fullname || 'Anonymous',
        email: context.user.email || undefined
      });
    }
  }, [context?.user, setUserId, setUserData]);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
