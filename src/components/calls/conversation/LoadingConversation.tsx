import React from 'react';
import { MessageSquare } from 'lucide-react';

export function LoadingConversation() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
      <MessageSquare className="w-12 h-12 mb-2 animate-pulse" />
      <p>Initializing conversation...</p>
      <p className="text-sm mt-1">Please wait while we connect</p>
    </div>
  );
}
