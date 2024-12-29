import React from 'react';
import { Phone, Calendar, Clock, CheckSquare, Square } from 'lucide-react';
import { QueueItem } from '../../../types/campaign';
import { formatDate, formatTime, formatPhoneNumber } from '../../../utils/formatters';
import { QueueStatusBadge } from '../../shared/tables/QueueStatusBadge';
import { cn } from '../../../utils/cn';

interface QueueTableRowProps {
  item: QueueItem;
  onClick: () => void;
  onSelect: () => void;
  isSelected: boolean;
}

export function QueueTableRow({ item, onClick, onSelect, isSelected }: QueueTableRowProps) {
  return (
    <tr 
      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-200"
    >
      <td className="px-6 py-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
        >
          {isSelected ? (
            <CheckSquare className="w-5 h-5" />
          ) : (
            <Square className="w-5 h-5" />
          )}
        </button>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center text-sm text-gray-900 dark:text-white">
          <Phone className="h-4 w-4 mr-2 text-gray-400" />
          {formatPhoneNumber(item.phone)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <QueueStatusBadge status={item.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-sm text-gray-900 dark:text-white">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            {formatDate(item.created_at)}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-2" />
            {formatTime(item.created_at)}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-sm text-gray-900 dark:text-white">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            {formatDate(item.updated_at)}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-2" />
            {formatTime(item.updated_at)}
          </div>
        </div>
      </td>
    </tr>
  );
}
