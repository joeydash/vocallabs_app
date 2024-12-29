import React, { useEffect, useRef } from 'react';
import { FileJson } from 'lucide-react';
import { CallData } from '../../types/call';
import { formatKey } from '../../utils/formatters';
import { cn } from '../../utils/cn';

interface LiveDataViewProps {
  data: CallData[];
}

export function LiveDataView({ data }: LiveDataViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sort data by created_at in ascending order
  const sortedData = [...data].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Auto-scroll to bottom when new data is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data]);

  if (!sortedData.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <FileJson className="w-12 h-12 mb-2" />
        <p>No data collected yet</p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="h-[calc(100vh-8rem)] overflow-y-auto p-4">
      <div className="space-y-2">
        {sortedData.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-md p-2 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary-400 dark:bg-primary-500" />
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {formatKey(item.key)}
                </h4>
              </div>
              <span
                className={cn(
                  "inline-flex px-2 py-0.5 rounded text-xs font-medium",
                  typeof item.value === 'boolean'
                    ? item.value
                      ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    : !isNaN(Number(item.value))
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                )}
              >
                {String(item.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
