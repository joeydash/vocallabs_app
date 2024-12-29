import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white truncate">{value}</p>
            {trend && (
              <span className="ml-2 text-xs sm:text-sm hidden sm:inline-block whitespace-nowrap ${
                trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }">
                {trend.isPositive ? '+' : '-'}{trend.value}%
              </span>
            )}
          </div>
        </div>
        <div className="p-2 sm:p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
          <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
    </div>
  );
}
