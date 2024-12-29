import { useState, useEffect } from 'react';
import { createGraphQLClient } from '../../services/graphql/client';
import { useAuth } from '../../services/auth';

const GET_CALL_TIMELINE = `
  query GetCallTimeline($phone_to: String!, $limit: Int!, $offset: Int!) {
    vocallabs_calls(
      where: { phone_to: { _eq: $phone_to } }
      limit: $limit
      offset: $offset
      order_by: { created_at: desc }
    ) {
      created_at
      call_status
      duration
    }
    vocallabs_calls_aggregate(
      where: { phone_to: { _eq: $phone_to } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

interface UseCallTimelineOptions {
  phoneNumber: string;
  limit?: number;
}

export function useCallTimeline({ phoneNumber, limit = 10 }: UseCallTimelineOptions) {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchCalls = async () => {
      if (!phoneNumber || !authToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const client = createGraphQLClient(authToken);
        const offset = (page - 1) * limit;

        const data = await client.request(GET_CALL_TIMELINE, {
          phone_to: phoneNumber,
          limit,
          offset,
        });

        setCalls(data.vocallabs_calls);
        setTotalCount(data.vocallabs_calls_aggregate.aggregate.count);
        setError(null);
      } catch (err) {
        console.error('Error fetching call timeline:', err);
        setError('Failed to fetch call history');
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [phoneNumber, page, limit, authToken]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    calls,
    loading,
    error,
    page,
    totalPages,
    setPage,
  };
}
