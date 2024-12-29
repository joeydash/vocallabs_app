import { useState, useCallback } from 'react';
import { useAuth } from '../../services/auth';
import { createGraphQLClient } from '../../services/graphql/client';
import { createQueueDetailsQuery } from '../../services/campaigns/queries/queueQueries';
import { QueueItem } from '../../types/campaign';

interface UseQueueDetailsProps {
  campaignId: string;
  filters: {
    dateRange: {
      from: string;
      to: string;
    };
  };
  page?: number;
  limit?: number;
}

interface QueueDetailsResponse {
  vocallabs_call_queue: QueueItem[];
  vocallabs_call_queue_aggregate: {
    aggregate: {
      count: number;
    };
  };
  startable_calls: {
    aggregate: {
      count: number;
    };
  };
}

export function useQueueDetails({ campaignId, filters, page = 1, limit = 10 }: UseQueueDetailsProps) {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [startableCount, setStartableCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useAuth();

  const fetchQueueDetails = useCallback(async () => {
    if (!campaignId || !authToken) return;

    try {
      setLoading(true);
      const client = createGraphQLClient(authToken);
      
      // Calculate offset based on page and limit
      const offset = (page - 1) * limit;
      
      // Build variables object with only active filters
      const variables: Record<string, any> = { 
        campaign_id: campaignId,
        limit,
        offset
      };
      
      if (filters.dateRange.from) variables.dateFrom = filters.dateRange.from;
      if (filters.dateRange.to) variables.dateTo = filters.dateRange.to;

      // Create query based on active filters
      const query = createQueueDetailsQuery({
        dateFrom: filters.dateRange.from,
        dateTo: filters.dateRange.to,
        withPagination: true
      });

      const data: QueueDetailsResponse = await client.request(query, variables);
      
      setQueueItems(data.vocallabs_call_queue);
      setTotalCount(data.vocallabs_call_queue_aggregate.aggregate.count);
      setStartableCount(data.startable_calls.aggregate.count);
      setError(null);
    } catch (err) {
      console.error('Error fetching queue details:', err);
      setError('Failed to fetch queue details');
    } finally {
      setLoading(false);
    }
  }, [campaignId, authToken, filters, page, limit]);

  return {
    queueItems,
    totalCount,
    startableCount,
    loading,
    error,
    refetch: fetchQueueDetails
  };
}
