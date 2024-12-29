import { useState, useEffect } from 'react';
import { useAuth } from '../../services/auth';
import { createGraphQLClient } from '../../services/graphql/client';

interface Token {
  id: string;
  name: string;
  service: string;
}

const GET_TOKENS = `
  query GetTokens($client_id: uuid!) {
    vocallabs_client_tokens(
      where: { client_id: { _eq: $client_id } }
      order_by: { service: asc, name: asc }
    ) {
      id
      name
      service
    }
  }
`;

export function useTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, authToken } = useAuth();

  useEffect(() => {
    const fetchTokens = async () => {
      if (!user?.id || !authToken) return;

      try {
        setLoading(true);
        const client = createGraphQLClient(authToken);
        const data = await client.request(GET_TOKENS, {
          client_id: user.id,
        });
        setTokens(data.vocallabs_client_tokens);
        setError(null);
      } catch (err) {
        console.error('Error fetching tokens:', err);
        setError('Failed to fetch tokens');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [user?.id, authToken]);

  return { tokens, loading, error };
}
