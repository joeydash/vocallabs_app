import { useState, useEffect } from 'react';
import { getCallStatus } from '../../services/graphql/queries/callQueries';
import { useAuth } from '../../services/auth';

export function useCallStatus(callId: string, disableLiveUpdates: boolean = false) {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useAuth();

  useEffect(() => {
    if (!callId || !authToken) {
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const callStatus = await getCallStatus(callId, authToken);
        if (callStatus) {
          setStatus(callStatus);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching call status:', err);
        setError('Failed to fetch call status');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    if (!disableLiveUpdates) {
      const interval = setInterval(fetchStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [callId, authToken, disableLiveUpdates]);

  return { status, loading, error };
}
