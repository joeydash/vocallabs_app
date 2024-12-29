import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../services/auth';
import { createGraphQLClient } from '../../services/graphql/client';
import { createFilteredCallsQuery } from '../../services/graphql/queries/filterQueries';
import { Call } from '../../types/call';
import { CallFilters } from '../../types/filters';

interface UseFilteredCallsProps {
  filters: CallFilters;
  page: number;
  limit: number;
}

export function useFilteredCalls({ filters, page, limit }: UseFilteredCallsProps) {
  const [state, setState] = useState<{
    calls: Call[];
    totalCount: number;
    loading: boolean;
    error: string | null;
  }>({
    calls: [],
    totalCount: 0,
    loading: true,
    error: null,
  });

  const { user, authToken } = useAuth();

  const fetchCalls = useCallback(async () => {
    if (!user?.id || !authToken) return;

    try {
      setState(prev => ({ ...prev, loading: true }));
      const client = createGraphQLClient(authToken);
      const offset = (page - 1) * limit;

      // Determine which filters are active
      const hasAgentId = Boolean(filters.agentId);
      const hasDateFrom = Boolean(filters.dateRange.from);
      const hasDateTo = Boolean(filters.dateRange.to);
      const hasStatus = Boolean(filters.status?.length);
      const hasPhoneNumber = Boolean(filters.phoneNumber);

      // Create dynamic query based on active filters
      const query = createFilteredCallsQuery(
        hasAgentId,
        hasDateFrom,
        hasDateTo,
        hasStatus,
        hasPhoneNumber
      );

      // Build variables object with only active filters
      const variables: Record<string, any> = {
        clientId: user.id,
        limit,
        offset,
      };

      if (hasAgentId) variables.agentId = filters.agentId;
      if (hasDateFrom) variables.dateFrom = filters.dateRange.from;
      if (hasDateTo) variables.dateTo = filters.dateRange.to;
      if (hasStatus) variables.status = filters.status;
      if (hasPhoneNumber) variables.phoneNumber = `%${filters.phoneNumber}%`;

      const data = await client.request(query, variables);

      setState({
        calls: data.vocallabs_calls,
        totalCount: data.vocallabs_calls_aggregate.aggregate.count,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error('Error fetching filtered calls:', err);
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch calls',
        loading: false,
      }));
    }
  }, [user?.id, authToken, filters, page, limit]);

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  return {
    ...state,
    refetch: fetchCalls,
  };
}
