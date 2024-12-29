import React from 'react';
import { MegaphoneIcon, Filter, RefreshCw, UserPlus, Play, Pause, Loader2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface QueueHeaderProps {
  onRefresh: () => void;
  onShowFilters: () => void;
  onShowAddContacts: () => void;
  onStartCampaign?: () => void;
  onStopCampaign?: () => void;
  isRefreshing: boolean;
  startingCampaign?: boolean;
  stoppingCampaign?: boolean;
  activeFiltersCount: number;
  startableCount?: number;
  hasPendingCalls?: boolean;
}

export function QueueHeader({
  onRefresh,
  onShowFilters,
  onShowAddContacts,
  onStartCampaign,
  onStopCampaign,
  isRefreshing,
  startingCampaign,
  stoppingCampaign,
  activeFiltersCount,
  startableCount,
  hasPendingCalls
}: QueueHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <MegaphoneIcon className="w-8 h-8 text-primary-500 dark:text-primary-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campaign Queue</h1>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={onRefresh}
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
          onClick={onShowFilters}
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
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 text-xs flex items-center justify-center bg-primary-500 text-white rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>

        <button
          onClick={onShowAddContacts}
          className={cn(
            "p-2 rounded-lg transition-colors duration-200",
            "text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300",
            "border border-gray-300 dark:border-gray-600",
            "hover:bg-gray-50 dark:hover:bg-gray-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          )}
          title="Add Contacts"
        >
          <UserPlus className="w-5 h-5" />
        </button>

        {hasPendingCalls && onStopCampaign && (
          <button
            onClick={onStopCampaign}
            disabled={stoppingCampaign}
            className={cn(
              "p-2 rounded-lg transition-colors duration-200",
              "text-white bg-red-600 dark:bg-red-500",
              "border border-transparent",
              "hover:bg-red-700 dark:hover:bg-red-600",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            title="Stop Campaign"
          >
            {stoppingCampaign ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Pause className="w-5 h-5" />
            )}
          </button>
        )}

        {startableCount && startableCount > 0 && onStartCampaign && (
          <button
            onClick={onStartCampaign}
            disabled={startingCampaign}
            className={cn(
              "p-2 rounded-lg transition-colors duration-200",
              "text-white bg-green-600 dark:bg-green-500",
              "border border-transparent",
              "hover:bg-green-700 dark:hover:bg-green-600",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            title="Start Campaign"
          >
            {startingCampaign ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
