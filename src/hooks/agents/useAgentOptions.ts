import { useState, useEffect } from 'react';
import { useAuth } from '../../services/auth';
import { createGraphQLClient } from '../../services/graphql/client';

interface Agent {
  id: string;
  name: string;
}

const GET_ACTIVE_AGENTS = `
  query GetActiveAgents($client_id: uuid!) {
    vocallabs_agent(
      order_by: {created_at: desc}, 
      where: {
        _and: [
          { client_id: { _eq: $client_id } },
          { active: { _eq: true } }
        ]
      }
    ) {
      name
      id
    }
  }
`;

export function useAgentOptions() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, authToken } = useAuth();

  useEffect(() => {
    const fetchAgents = async () => {
      if (!user?.id || !authToken) return;

      try {
        setLoading(true);
        const client = createGraphQLClient(authToken);
        const data = await client.request(GET_ACTIVE_AGENTS, {
          client_id: user.id,
        });
        setAgents(data.vocallabs_agent);
        setError(null);
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError('Failed to load agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [user?.id, authToken]);

  return { agents, loading, error };
}
