import { useState } from 'react';
import { callsApi } from '../services/calls/api/callsApi';
import { showErrorToast } from '../utils/toast';
import { useAuth } from '../services/auth';

interface MakeCallInput {
  number: string;
  agent_id?: string;
}

export function useCall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, authToken } = useAuth();

  const makeCall = async (input: MakeCallInput) => {
    if (!user?.id || !authToken) {
      setError('Authentication required');
      showErrorToast('Please log in to make calls');
      return null;
    }

    if (!input.agent_id) {
      setError('Agent ID is required');
      showErrorToast('Please select an agent to make the call');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const callId = await callsApi.makeCall({
        number: input.number,
        agent_id: input.agent_id,
        client_id: user.id,
        authToken
      });
      
      return callId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate call';
      setError(errorMessage);
      showErrorToast(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { makeCall, loading, error };
}
