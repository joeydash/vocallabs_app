import React from 'react';
import { MessageSquare } from 'lucide-react';

export function EmptyConversation() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
      <MessageSquare className="w-12 h-12 mb-2" />
      <p>No messages yet</p>
      <p className="text-sm mt-1">The conversation will appear here</p>
    </div>
  );
}
