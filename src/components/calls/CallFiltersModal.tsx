import React, { useState, useEffect } from 'react';
import { Modal } from '../shared/Modal';
import { AgentSelect } from '../shared/AgentSelect';
import { ContactSearchInput } from './ContactSearchInput';
import { DateRangeFilter } from './filters/DateRangeFilter';
import { StatusFilter } from './filters/StatusFilter';
import { FilterActions } from './filters/FilterActions';
import { CallFilters } from '../../types/filters';
import { Contact } from '../../types/contact';
import { Agent } from '../../types/agent';
import { Bot, Filter, X, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CallFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: CallFilters) => void;
  agents?: Agent[];
  languages?: Array<{ code: string; name: string }>;
  statuses?: Array<{ call_status: string }>;
  currentFilters: CallFilters;
  loading?: boolean;
  error?: string | null;
}

export function CallFiltersModal({
  isOpen,
  onClose,
  onApplyFilters,
  agents = [],
  statuses = [],
  currentFilters,
  loading,
  error
}: CallFiltersModalProps) {
  const [filters, setFilters] = useState<CallFilters>(currentFilters);

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
      },
      status: [],
    });
  };

  const handleSelectContact = (contact: Contact) => {
    setFilters(prev => ({
      ...prev,
      phoneNumber: contact.phone
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Calls">
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

        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Bot className="w-5 h-5 text-gray-400" />
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Agent
            </label>
          </div>
          <AgentSelect
            value={filters.agentId || ''}
            onChange={(value) => setFilters(prev => ({
              ...prev,
              agentId: value || undefined
            }))}
          />
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
          </div>
          <ContactSearchInput
            value={filters.phoneNumber || ''}
            onChange={(value) => setFilters(prev => ({
              ...prev,
              phoneNumber: value || undefined
            }))}
            onSelectContact={handleSelectContact}
          />
        </div>

        {statuses.length > 0 && (
          <StatusFilter
            selectedStatuses={filters.status || []}
            availableStatuses={statuses}
            onChange={(newStatuses) => setFilters(prev => ({
              ...prev,
              status: newStatuses.length > 0 ? newStatuses : undefined
            }))}
          />
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
          <button
            onClick={handleClearFilters}
            className={cn(
              "p-2 rounded-lg transition-colors duration-200",
              "text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300",
              "border border-gray-300 dark:border-gray-600",
              "hover:bg-gray-50 dark:hover:bg-gray-700",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            )}
            title="Clear Filters"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-lg transition-colors duration-200",
              "text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300",
              "border border-gray-300 dark:border-gray-600",
              "hover:bg-gray-50 dark:hover:bg-gray-700",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            )}
            title="Cancel"
          >
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={handleApply}
            disabled={loading}
            className={cn(
              "p-2 rounded-lg transition-colors duration-200",
              "text-white bg-primary-600 dark:bg-primary-500",
              "border border-transparent",
              "hover:bg-primary-700 dark:hover:bg-primary-600",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            title="Apply Filters"
          >
            <Check className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Modal>
  );
}
