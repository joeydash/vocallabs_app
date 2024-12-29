import React from 'react';
import { cn } from '../../../utils/cn';

export function ChatLoadingAnimation() {
  return (
    <div className="flex items-center space-x-2 p-4">
      <div className="flex space-x-1">
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={cn(
              "w-2 h-2 rounded-full bg-primary-400 dark:bg-primary-500",
              "animate-bounce",
              dot === 1 && "animation-delay-0",
              dot === 2 && "animation-delay-150",
              dot === 3 && "animation-delay-300"
            )}
            style={{
              animationDuration: '1s',
              animationDelay: `${(dot - 1) * 0.15}s`
            }}
          />
        ))}
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Message incoming...
      </span>
    </div>
  );
}
