import React from 'react';
import { Bot, User } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Message } from '../../../types/call';

interface ConversationMessageProps {
  message: Message;
}

export function ConversationMessage({ message }: ConversationMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={cn(
      "flex items-start space-x-2",
      isAssistant ? 'justify-start' : 'justify-end'
    )}>
      {isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        </div>
      )}
      <div className="flex flex-col">
        <div className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          isAssistant
            ? "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
            : "bg-primary-100 dark:bg-primary-900/50"
        )}>
          <p className="text-sm text-gray-900 dark:text-gray-100">
            {message.content}
          </p>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      {!isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
          <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        </div>
      )}
    </div>
  );
}
