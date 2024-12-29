import React, { useState } from 'react';
import { useAuth } from '../../services/auth';
import { createGraphQLClient } from '../../services/graphql/client';
import { QueueTable } from '../../components/campaigns/queue/QueueTable';
import { CallDetailsSidebar } from '../../components/calls/CallDetailsSidebar';
import { QueueFiltersModal } from '../../components/campaigns/queue/QueueFiltersModal';
import { Call } from '../../types/call';
import { cn } from '../../utils/cn';
import { Filter, RefreshCw, MegaphoneIcon } from 'lucide-react';
import { Pagination } from '../../components/shared/Pagination';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { deleteQueueItems } from '../../services/campaigns/mutations/deleteQueueItems';

const GET_QUEUE = `
  query GetQueue(
    $client_id: uuid!, 
    $limit: Int!, 
    $offset: Int!,
    $where: vocallabs_call_queue_bool_exp!
  ) {
    vocallabs_call_queue(
      where: {
        _and: [
          { campaign: { client_id: { _eq: $client_id } } },
          $where
        ]
      }
      order_by: { created_at: desc }
      limit: $limit
      offset: $offset
    ) {
      id
      phone
      status
      created_at
      updated_at
      call_id
      campaign {
        name
      }
    }
    vocallabs_call_queue_aggregate(
      where: {
        _and: [
          { campaign: { client_id: { _eq: $client_id } } },
          $where
        ]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

const GET_CALL_DETAILS = `
  query GetCallDetails($call_id: uuid!) {
    vocallabs_calls_by_pk(id: $call_id) {
      id
      plivo_call_id
      recording_url
      agent_id
      agent {
        name
      }
      created_at
      updated_at
      phone_from
      phone_to
      call_status
    }
  }
`;

interface QueueFilters {
  dateRange: {
    from: string;
    to: string;
  };
}

const ITEMS_PER_PAGE = 10;

const initialFilters: QueueFilters = {
  dateRange: {
    from: '',
    to: '',
  }
};

export function CallQueue() {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [filters, setFilters] = useState<QueueFilters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [queueItems, setQueueItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { user, authToken } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchQueue = React.useCallback(async () => {
    if (!user?.id || !authToken) return;

    try {
      setLoading(true);
      const client = createGraphQLClient(authToken);
      
      const where: any = {};
      
      if (filters.dateRange.from) {
        where.created_at = { _gte: filters.dateRange.from };
      }
      
      if (filters.dateRange.to) {
        where.created_at = { 
          ...where.created_at,
          _lte: filters.dateRange.to 
        };
      }

      const offset = (page - 1) * ITEMS_PER_PAGE;

      const data = await client.request(GET_QUEUE, {
        client_id: user.id,
        where,
        limit: ITEMS_PER_PAGE,
        offset
      });
      
      setQueueItems(data.vocallabs_call_queue);
      setTotalCount(data.vocallabs_call_queue_aggregate.aggregate.count);
      setError(null);
    } catch (e) {
      console.error('Error fetching queue:', e);
      setError('Failed to fetch queue');
    } finally {
      setLoading(false);
    }
  }, [user?.id, authToken, filters, page]);

  const fetchCallDetails = async (callId: string) => {
    if (!authToken) return;

    try {
      const client = createGraphQLClient(authToken);
      const data = await client.request(GET_CALL_DETAILS, { call_id: callId });
      setSelectedCall(data.vocallabs_calls_by_pk);
    } catch (e) {
      console.error('Error fetching call details:', e);
    }
  };

  React.useEffect(() => {
    if (user?.id) {
      fetchQueue();
    }
  }, [user?.id, fetchQueue]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchQueue();
    setIsRefreshing(false);
  };

  const handleSelectCall = async (callId: string) => {
    if (callId) {
      await fetchCallDetails(callId);
    }
  };

  const handleApplyFilters = (newFilters: QueueFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleDeleteMultiple = async (ids: string[]) => {
    if (!authToken || isDeleting) return;

    try {
      setIsDeleting(true);
      await deleteQueueItems(ids, authToken);
      await fetchQueue();
    } catch (err) {
      showErrorToast('Failed to delete items');
    } finally {
      setIsDeleting(false);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    return count;
  };

  return (
    <div className={cn(
      "space-y-6 transition-all duration-300",
      selectedCall ? 'md:mr-96' : ''
    )}>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <MegaphoneIcon className="w-8 h-8 text-primary-500 dark:text-primary-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Call Queue</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={cn(
              "p-2 rounded-lg transition-colors duration-200",
              "text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300",
              "border border-gray-300 dark:border-gray-600",
              "hover:bg-gray-50 dark:hover:bg-gray-700",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            title="Refresh"
          >
            <RefreshCw 
              className={cn(
                "w-5 h-5",
                isRefreshing && "animate-spin"
              )} 
            />
          </button>

          <button
            onClick={() => setShowFilters(true)}
            className={cn(
              "p-2 rounded-lg transition-colors duration-200",
              "text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300",
              "border border-gray-300 dark:border-gray-600",
              "hover:bg-gray-50 dark:hover:bg-gray-700",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
              "relative"
            )}
            title="Filters"
          >
            <Filter className="w-5 h-5" />
            {getActiveFiltersCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-xs flex items-center justify-center bg-primary-500 text-white rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <QueueTable
            items={queueItems}
            onSelectCall={handleSelectCall}
            onDeleteMultiple={handleDeleteMultiple}
          />

          {totalCount > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(totalCount / ITEMS_PER_PAGE)}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {selectedCall && (
        <CallDetailsSidebar
          call={selectedCall}
          onClose={() => setSelectedCall(null)}
        />
      )}

      <QueueFiltersModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </div>
  );
}
