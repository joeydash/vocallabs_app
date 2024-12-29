import React from 'react';
import { Call } from '../../types/call';
import { CallTableRow } from './CallTableRow';

interface CallTableProps {
  calls: Call[];
  onSelectCall: (call: Call) => void;
}

export function CallTable({ calls, onSelectCall }: CallTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Call Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Agent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Phone Numbers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date & Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {calls.map((call) => (
              <CallTableRow
                key={call.id}
                call={call}
                onClick={() => onSelectCall(call)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
