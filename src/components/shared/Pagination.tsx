import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const buttonBaseClasses = cn(
    "inline-flex items-center justify-center min-w-[2rem] h-8 px-2",
    "text-sm font-medium rounded-md",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
    "dark:focus:ring-offset-gray-900 transition-colors duration-200"
  );

  const activeClasses = "bg-primary-600 text-white hover:bg-primary-700";
  const inactiveClasses = "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
  const disabledClasses = "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400";

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(buttonBaseClasses, currentPage === 1 ? disabledClasses : inactiveClasses)}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            buttonBaseClasses,
            currentPage === page ? activeClasses : inactiveClasses
          )}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(buttonBaseClasses, currentPage === totalPages ? disabledClasses : inactiveClasses)}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
