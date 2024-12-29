import React from 'react';
import { cn } from '../../../utils/cn';

interface ImportPreviewProps {
  contacts: Array<Record<string, any>>;
  columnMappings: {
    name: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    notes: string | null;
  };
}

export function ImportPreview({ contacts, columnMappings }: ImportPreviewProps) {
  if (contacts.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
        Preview ({contacts.length} contacts)
      </h3>
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {contacts.map((row, index) => (
            <li key={index} className="px-4 py-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {columnMappings.name && (
                  <div className="text-sm text-gray-900 dark:text-white truncate">
                    {row[columnMappings.name]}
                  </div>
                )}
                {columnMappings.phone && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {row[columnMappings.phone]}
                  </div>
                )}
                {columnMappings.email && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {row[columnMappings.email]}
                  </div>
                )}
                {columnMappings.address && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {row[columnMappings.address]}
                  </div>
                )}
                {columnMappings.notes && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {row[columnMappings.notes]}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
