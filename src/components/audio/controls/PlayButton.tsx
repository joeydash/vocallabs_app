import React from 'react';
import { Play, Pause } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface PlayButtonProps {
  isPlaying: boolean;
  onClick: () => void;
}

export function PlayButton({ isPlaying, onClick }: PlayButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-full transition-colors duration-200",
        "bg-primary-100 hover:bg-primary-200",
        "dark:bg-primary-900/30 dark:hover:bg-primary-800/50",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
      )}
    >
      {isPlaying ? (
        <Pause className="w-5 h-5 text-primary-600 dark:text-primary-400" />
      ) : (
        <Play className="w-5 h-5 text-primary-600 dark:text-primary-400" />
      )}
    </button>
  );
}
