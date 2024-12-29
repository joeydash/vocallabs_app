import React from 'react';
import { Phone, Trash2, Loader2 } from 'lucide-react';
import { formatDate, formatTime } from '../../../../utils/formatters';
import { cn } from '../../../../utils/cn';
import { PhoneNumber } from '../types';

interface PhoneNumberListProps {
  phoneNumbers: PhoneNumber[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
}

export function PhoneNumberList({ phoneNumbers, loading, onDelete }: PhoneNumberListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (phoneNumbers.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <Phone className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400">No phone numbers added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Connected Phone Numbers
      </h3>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {phoneNumbers.map((number) => (
          <div 
            key={number.id}
            className="py-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Phone className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {number.phone}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Added {formatDate(number.created_at)} at {formatTime(number.created_at)}
                </p>
              </div>
            </div>
            <button
              onClick={() => onDelete(number.id)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                "text-red-600 hover:bg-red-50",
                "dark:text-red-400 dark:hover:bg-red-900/30"
              )}
              title="Delete phone number"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
