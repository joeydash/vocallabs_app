import React from 'react';
import { X, Phone } from 'lucide-react';
import { useCallTimeline } from '../../hooks/calls/useCallTimeline';
import { CallTimeline } from './CallTimeline';
import { cn } from '../../utils/cn';

interface ContactTimelineSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  contact: {
    name: string;
    phone: string;
  } | null;
}

export function ContactTimelineSidebar({ isOpen, onClose, contact }: ContactTimelineSidebarProps) {
  const { 
    calls, 
    loading, 
    error, 
    page, 
    totalPages, 
    setPage 
  } = useCallTimeline({
    phoneNumber: contact?.phone || '',
    limit: 10
  });

  if (!contact) return null;

  return (
    <div className={cn(
      "fixed inset-y-0 right-0 z-40",
      "w-full md:w-96 max-w-full",
      "bg-white dark:bg-gray-800",
      "border-l border-gray-200 dark:border-gray-700",
      "transform transition-transform duration-300 ease-in-out",
      "flex flex-col h-[calc(100vh-4rem)]",
      "mt-16", // Add top margin equal to navbar height
      !isOpen && 'translate-x-full'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {contact.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {contact.phone}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <CallTimeline
          calls={calls}
          loading={loading}
          error={error}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
