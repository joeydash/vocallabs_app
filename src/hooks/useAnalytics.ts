import { useCallback } from 'react';
import { trackEvent, setUserProperties, identifyUser } from '../utils/analytics';

export function useAnalytics() {
  const logEvent = useCallback((name: string, properties?: Record<string, any>) => {
    trackEvent({ name, properties });
  }, []);

  const setUserData = useCallback((properties: Record<string, any>) => {
    setUserProperties(properties);
  }, []);

  const setUserId = useCallback((userId: string) => {
    identifyUser(userId);
  }, []);

  return {
    logEvent,
    setUserData,
    setUserId
  };
}
