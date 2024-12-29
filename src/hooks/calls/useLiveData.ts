import { useState, useEffect } from 'react';
import { createClient } from 'graphql-ws';
import { CallData } from '../../types/call';
import { useAuth } from '../../services/auth';

const LIVE_DATA_SUBSCRIPTION = `
  subscription LiveDataSubscription($call_id: uuid = "") {
    vocallabs_call_data(
      where: { 
        call_id: { _eq: $call_id },
        type: { _eq: "external" }
      }
      order_by: { created_at: desc }
    ) {
      id
      key
      value
      created_at
    }
  }
`;

export function useLiveData(callId: string, disableLiveUpdates: boolean = false) {
  const [data, setData] = useState<CallData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useAuth();

  useEffect(() => {
    if (!callId || !authToken || disableLiveUpdates) {
      setLoading(false);
      return;
    }

    const client = createClient({
      url: 'wss://db.vocallabs.ai/v1/graphql',
      connectionParams: {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    });

    setLoading(true);
    setError(null);

    const unsubscribe = client.subscribe(
      {
        query: LIVE_DATA_SUBSCRIPTION,
        variables: { call_id: callId },
      },
      {
        next: (data: any) => {
          const callData = data.data.vocallabs_call_data.map((item: any) => ({
            id: item.id,
            key: item.key,
            value: item.value,
            created_at: item.created_at
          }));
          setData(callData);
          setLoading(false);
        },
        error: (err) => {
          console.error('Subscription error:', err);
          setError('Failed to connect to live data');
          setLoading(false);
        },
        complete: () => {
          setLoading(false);
        },
      },
    );

    return () => {
      unsubscribe();
    };
  }, [callId, authToken, disableLiveUpdates]);

  return { data, loading, error };
}
