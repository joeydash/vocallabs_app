import React from 'react';
import { UserCheck, Loader2 } from 'lucide-react';

interface ContactStatusProps {
  isExisting: boolean | null;
  loading: boolean;
}

export function ContactStatus({ isExisting, loading }: ContactStatusProps) {
  if (loading) {
    return (
      <div className="flex items-center text-gray-500 dark:text-gray-400">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        <span className="text-sm">Checking contact...</span>
      </div>
    );
  }

  if (isExisting === null) {
    return null;
  }

  return (
    <div className="flex items-center">
      {isExisting ? (
        <>
          <UserCheck className="w-4 h-4 mr-2 text-green-500" />
          <span className="text-sm text-green-600 dark:text-green-400">Contact exists</span>
        </>
      ) : (
        <span className="text-sm text-amber-600 dark:text-amber-400">Contact not found</span>
      )}
    </div>
  );
}
