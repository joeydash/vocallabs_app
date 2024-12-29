import { useState, useEffect } from 'react';
import { useAuth } from '../../services/auth';
import { createGraphQLClient } from '../../services/graphql/client';
import { GET_CALL_STATUSES } from '../../services/graphql/queries/filterQueries';

interface FilterOptions {
  statuses: Array<{ call_status: string }>;
  loading: boolean;
  error: string | null;
}

export function useCallFilters() {
  const [options, setOptions] = useState<FilterOptions>({
    statuses: [],
    loading: true,
    error: null,
  });
  const { user, authToken } = useAuth();

  useEffect(() => {
    const fetchFilterOptions = async () => {
      if (!user?.id || !authToken) return;

      try {
        const client = createGraphQLClient(authToken);
        const data = await client.request(GET_CALL_STATUSES, {
          client_id: user.id,
        });

        setOptions({
          statuses: data.vocallabs_calls,
          loading: false,
          error: null,
        });
      } catch (err) {
        setOptions(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load filter options',
        }));
      }
    };

    fetchFilterOptions();
  }, [user?.id, authToken]);

  return options;
}
