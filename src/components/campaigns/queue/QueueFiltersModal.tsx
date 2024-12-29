import React, { useState, useEffect } from 'react';
import { Modal } from '../../shared/Modal';
import { DateRangeFilter } from '../../calls/filters/DateRangeFilter';
import { FilterActions } from '../../calls/filters/FilterActions';
import { cn } from '../../../utils/cn';

interface QueueFilters {
  dateRange: {
    from: string;
    to: string;
  };
}

interface QueueFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: QueueFilters) => void;
  currentFilters: QueueFilters;
  loading?: boolean;
  error?: string | null;
}

export function QueueFiltersModal({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
  loading,
  error
}: QueueFiltersModalProps) {
  const [filters, setFilters] = useState<QueueFilters>(currentFilters);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      dateRange: {
        from: '',
        to: '',
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Queue">
      <div className="p-4 sm:p-6 space-y-6 max-h-[calc(100vh-10rem)] overflow-y-auto">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 p-4">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        <DateRangeFilter
          from={filters.dateRange.from}
          to={filters.dateRange.to}
          onChange={(range) => setFilters(prev => ({ ...prev, dateRange: range }))}
          onClear={() => setFilters(prev => ({ ...prev, dateRange: { from: '', to: '' } }))}
        />

        <FilterActions
          onClear={handleClearFilters}
          onCancel={onClose}
          onApply={handleApply}
          loading={loading}
        />
      </div>
    </Modal>
  );
}
