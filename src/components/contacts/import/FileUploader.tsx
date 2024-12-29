import React, { useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface FileUploaderProps {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileTypes?: string[];
}

export function FileUploader({ onFileSelect, fileTypes = ['.xlsx', '.xls'] }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        <FileSpreadsheet className="w-12 h-12 text-gray-400 mb-4" />
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload an Excel file containing your contacts
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            File should have columns for "name" and "phone"
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={fileTypes.join(',')}
          onChange={onFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md",
            "text-white bg-primary-600",
            "hover:bg-primary-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          )}
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose File
        </button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
              File Format Requirements
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">
              <ul className="list-disc pl-5 space-y-1">
                <li>Excel file (.xlsx or .xls)</li>
                <li>Columns should be named "name" and "phone"</li>
                <li>Phone numbers should be in international format</li>
                <li>One contact per row</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
