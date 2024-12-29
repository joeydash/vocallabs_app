import React from 'react';

interface TimeDisplayProps {
  currentTime: number;
  duration: number;
  isMobile?: boolean;
}

export function TimeDisplay({ currentTime, duration, isMobile = false }: TimeDisplayProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isMobile) {
    return (
      <div className="flex items-center justify-between w-full">
        <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[3rem]">
          {formatTime(currentTime)}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[3rem] text-right">
          {formatTime(duration)}
        </span>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {formatTime(currentTime)}
      </span>
      <span className="text-sm text-gray-500 dark:text-gray-400">/</span>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {formatTime(duration)}
      </span>
    </div>
  );
}
