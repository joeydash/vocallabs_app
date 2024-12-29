import React from 'react';
import { Phone, Calendar, Clock, Bot } from 'lucide-react';
import { Call } from '../../types/call';
import { formatDate, formatTime, formatPhoneNumber } from '../../utils/formatters';
import { cn } from '../../utils/cn';

interface CallTableRowProps {
  call: Call;
  onClick: () => void;
}

export function CallTableRow({ call, onClick }: CallTableRowProps) {
  const statusColors = {
    done: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-700 dark:text-green-400',
      dot: 'bg-green-500',
      border: 'border-green-200 dark:border-green-900/50'
    },
    completed: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-700 dark:text-green-400',
      dot: 'bg-green-500',
      border: 'border-green-200 dark:border-green-900/50'
    },
    pending: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-700 dark:text-amber-400',
      dot: 'bg-amber-500',
      border: 'border-amber-200 dark:border-amber-900/50'
    },
    'in-progress': {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-700 dark:text-amber-400',
      dot: 'bg-amber-500',
      border: 'border-amber-200 dark:border-amber-900/50'
    },
    default: {
      bg: 'bg-gray-50 dark:bg-gray-900/20',
      text: 'text-gray-700 dark:text-gray-400',
      dot: 'bg-gray-500',
      border: 'border-gray-200 dark:border-gray-900/50'
    }
  };

  const status = statusColors[call.call_status as keyof typeof statusColors] || statusColors.default;

  return (
    <tr 
      onClick={onClick}
      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
    >
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-white font-medium">
          {call.plivo_call_id}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          ID: {call.id.slice(0, 8)}...
        </div>
        <div className="mt-2">
          <span className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
            status.bg,
            status.text,
            status.border
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", status.dot)} />
            {call.call_status.charAt(0).toUpperCase() + call.call_status.slice(1)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <Bot className="h-4 w-4 text-primary-500 dark:text-primary-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {call.agent.name}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-sm text-gray-900 dark:text-white">
            <Phone className="h-4 w-4 mr-2 text-green-500" />
            From: {formatPhoneNumber(call.phone_from)}
          </div>
          <div className="flex items-center text-sm text-gray-900 dark:text-white">
            <Phone className="h-4 w-4 mr-2 text-blue-500" />
            To: {formatPhoneNumber(call.phone_to)}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-sm text-gray-900 dark:text-white">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            {formatDate(call.created_at)}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-2" />
            {formatTime(call.created_at)}
          </div>
        </div>
      </td>
    </tr>
  );
}
