import React, { useState } from 'react';
import { useFilteredCalls } from '../../hooks/calls/useFilteredCalls';
import { useCallFilters } from '../../hooks/calls/useCallFilters';
import { AudioModal } from '../../components/audio/AudioModal';
import { CallTable } from '../../components/calls/CallTable';
import { Pagination } from '../../components/shared/Pagination';
import { Call } from '../../types/call';
import { CallFilters } from '../../types/filters';
import { CallDetailsSidebar } from '../../components/calls/CallDetailsSidebar';
import { CallFiltersModal } from '../../components/calls/CallFiltersModal';
import { cn } from '../../utils/cn';
import { Filter, RefreshCw } from 'lucide-react';

const CALLS_PER_PAGE = 10;

const initialFilters: CallFilters = {
  dateRange: {
    from: '',
    to: '',
  },
  status: [],
};

export function CallHistory() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<CallFilters>(initialFilters);
  const [selectedRecording, setSelectedRecording] = useState<string | null>(null);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filterOptions = useCallFilters();
  const { calls, loading, error, totalCount, refetch } = useFilteredCalls({
    filters,
    page,
    limit: CALLS_PER_PAGE,
  });

  const handlePlayRecording = (url: string) => {
    setSelectedRecording(url);
  };

  const handleApplyFilters = (newFilters: CallFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.agentId) count++;
    if (filters.phoneNumber) count++;
    if (filters.status?.length) count++;
    if (filters.language) count++;
    return count;
  };

  const totalPages = Math.ceil(totalCount / CALLS_PER_PAGE);

  if (loading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className={cn(
      "space-y-6 transition-all duration-300",
      selectedCall ? 'md:mr-96' : ''
    )}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Call History</h1>
        
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

      <CallTable
        calls={calls}
        onSelectCall={setSelectedCall}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {selectedCall && (
        <CallDetailsSidebar
          call={selectedCall}
          onClose={() => setSelectedCall(null)}
          onPlayRecording={handlePlayRecording}
        />
      )}

      {selectedRecording && (
        <AudioModal
          isOpen={!!selectedRecording}
          onClose={() => setSelectedRecording(null)}
          url={selectedRecording}
          title="Call Recording"
        />
      )}

      <CallFiltersModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
        agents={filterOptions.agents}
        languages={filterOptions.languages}
        statuses={filterOptions.statuses}
        currentFilters={filters}
        loading={filterOptions.loading}
        error={filterOptions.error}
      />
    </div>
  );
}
