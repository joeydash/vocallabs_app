import { useState, useEffect } from 'react';
import { getCallData } from '../../services/graphql/queries/callQueries';
import { useAuth } from '../../services/auth';
import { CallData } from '../../types/call';

export function useCallData(callId: string) {
  const [data, setData] = useState<CallData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!callId || !authToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const callData = await getCallData(callId, authToken);
        setData(callData);
        setError(null);
      } catch (err) {
        console.error('Error fetching call data:', err);
        setError('Failed to fetch call data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [callId, authToken]);

  return { data, loading, error };
}
