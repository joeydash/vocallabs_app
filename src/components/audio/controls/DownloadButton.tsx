import React from 'react';
import { Download } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface DownloadButtonProps {
  onDownload: () => void;
}

export function DownloadButton({ onDownload }: DownloadButtonProps) {
  return (
    <button
      onClick={onDownload}
      className={cn(
        "p-2 rounded-full transition-colors duration-200",
        "hover:bg-gray-100 dark:hover:bg-gray-700",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
      )}
      title="Download recording"
    >
      <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
    </button>
  );
}
