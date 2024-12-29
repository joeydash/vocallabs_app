import React from 'react';
import { formatDate, formatTime, formatPhoneNumber } from '../../utils/formatters';
import { Bot, Phone } from 'lucide-react';
import { cn } from '../../utils/cn';
import { CallStatusBadge } from '../calls/status/CallStatusBadge';

interface RecentCall {
  id: string;
  agent: {
    name: string;
  };
  created_at: string;
  phone_to: string;
  call_status: string;
}

interface RecentCallsListProps {
  calls: RecentCall[];
}

export function RecentCallsList({ calls }: RecentCallsListProps) {
  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-700">
      {calls.map((call) => (
        <div key={call.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 dark:text-primary-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-none">
                    {call.agent.name}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {formatPhoneNumber(call.phone_to)}
                </p>
                <div className="mt-1">
                  <CallStatusBadge status={call.call_status} />
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm text-gray-900 dark:text-white">{formatDate(call.created_at)}</p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{formatTime(call.created_at)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
