import React from 'react';
import { MegaphoneIcon, UserPlus } from 'lucide-react';

interface EmptyQueueStateProps {
  onAddContacts: () => void;
}

export function EmptyQueueState({ onAddContacts }: EmptyQueueStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
      <div className="flex flex-col items-center text-center max-w-sm">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6">
          <MegaphoneIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Contacts in Queue
        </h3>
        
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Start by adding contacts to your campaign queue. You can add contacts from your existing contact groups.
        </p>

        <button
          onClick={onAddContacts}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Contacts
        </button>
      </div>
    </div>
  );
}
