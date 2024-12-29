import React from 'react';
import { cn } from '../../../utils/cn';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (value: number) => void;
}

export function ProgressBar({ currentTime, duration, onSeek }: ProgressBarProps) {
  return (
    <div className="w-full px-2">
      <input
        type="range"
        min="0"
        max={duration || 100}
        value={currentTime}
        onChange={(e) => onSeek(parseFloat(e.target.value))}
        className={cn(
          "w-full h-1.5 rounded-lg appearance-none cursor-pointer",
          "bg-gray-200 dark:bg-gray-700",
          "[&::-webkit-slider-thumb]:appearance-none",
          "[&::-webkit-slider-thumb]:w-3",
          "[&::-webkit-slider-thumb]:h-3",
          "[&::-webkit-slider-thumb]:rounded-full",
          "[&::-webkit-slider-thumb]:bg-primary-600",
          "[&::-webkit-slider-thumb]:dark:bg-primary-400",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
        )}
      />
    </div>
  );
}
