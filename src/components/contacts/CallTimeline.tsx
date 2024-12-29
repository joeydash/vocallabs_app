import React from 'react';
import { formatDate, formatTime } from '../../utils/formatters';
import { Phone, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Pagination } from '../shared/Pagination';
import { LoadingSpinner } from '../shared/LoadingSpinner';

interface CallTimelineEntry {
  created_at: string;
  call_status: string;
  duration: number;
}

interface CallTimelineProps {
  calls: CallTimelineEntry[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CallTimeline({ 
  calls, 
  loading, 
  error,
  currentPage,
  totalPages,
  onPageChange
}: CallTimelineProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (calls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <Phone className="w-8 h-8 mb-2" />
        <p>No call history found</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'done':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'in-progress':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flow-root">
        <ul className="-mb-8">
          {calls.map((call, idx) => (
            <li key={idx}>
              <div className="relative pb-8">
                {idx !== calls.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800",
                      getStatusColor(call.call_status)
                    )}>
                      <Phone className="h-4 w-4 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Call {call.call_status.toLowerCase()}
                      </p>
                      <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="mr-1.5 h-4 w-4 flex-shrink-0" />
                        Duration: {Math.round(call.duration / 60)} minutes
                      </div>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                      <div>{formatDate(call.created_at)}</div>
                      <div>{formatTime(call.created_at)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
