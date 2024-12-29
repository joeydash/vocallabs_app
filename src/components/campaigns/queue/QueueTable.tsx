import React, { useState } from 'react';
import { QueueItem } from '../../../types/campaign';
import { QueueTableRow } from './QueueTableRow';
import { cn } from '../../../utils/cn';
import { CheckSquare, Square, Trash2 } from 'lucide-react';

interface QueueTableProps {
  items: QueueItem[];
  onSelectCall: (callId: string) => void;
  onDeleteMultiple?: (ids: string[]) => Promise<void>;
}

export function QueueTable({ items, onSelectCall, onDeleteMultiple }: QueueTableProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkDelete = async () => {
    if (onDeleteMultiple && selectedItems.size > 0 && !isDeleting) {
      try {
        setIsDeleting(true);
        await onDeleteMultiple(Array.from(selectedItems));
        setSelectedItems(new Set());
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      {selectedItems.size > 0 && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {selectedItems.size} item{selectedItems.size > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={handleBulkDelete}
            disabled={isDeleting}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            {isDeleting ? 'Deleting...' : 'Delete Selected'}
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={toggleSelectAll}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                >
                  {selectedItems.size === items.length ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item) => (
              <QueueTableRow
                key={item.id}
                item={item}
                onClick={() => item.call_id && onSelectCall(item.call_id)}
                onSelect={() => toggleSelect(item.id)}
                isSelected={selectedItems.has(item.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
