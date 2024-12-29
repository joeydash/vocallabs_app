import React, { useState } from 'react';
import { Modal } from '../shared/Modal';
import { ArrowRight, Loader2 } from 'lucide-react';
import { read, utils } from 'xlsx';
import { GroupSearchInput } from './groups/GroupSearchInput';
import { FileUploader } from './import/FileUploader';
import { ImportPreview } from './import/ImportPreview';
import { cn } from '../../utils/cn';
import { showErrorToast } from '../../utils/toast';
import { ContactGroup } from '../../types/contact';
import { ColumnMappingDropdown } from './import/ColumnMappingDropdown';

interface ImportContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (contacts: Array<{ name: string; phone: string }>, groupId?: string) => Promise<void>;
  groupId?: string;
  requireGroup?: boolean;
}

export function ImportContactsModal({ 
  isOpen, 
  onClose, 
  onImport,
  groupId: defaultGroupId,
  requireGroup = false 
}: ImportContactsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<Array<Record<string, any>>>([]);
  const [columnHeaders, setColumnHeaders] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<{
    name: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    notes: string | null;
  }>({
    name: null,
    phone: null,
    email: null,
    address: null,
    notes: null,
  });
  const [skipHeader, setSkipHeader] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState(defaultGroupId || '');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length === 0) {
        showErrorToast('Excel file is empty');
        return;
      }

      const headers = jsonData[0] as string[];
      const dataRows = jsonData.slice(skipHeader ? 1 : 0) as Array<Record<string, any>>;

      setColumnHeaders(headers);
      setPreviewData(dataRows.slice(0, 5));
      setFile(file);
      setValidationErrors([]);
    } catch (err) {
      console.error('Error reading Excel file:', err);
      showErrorToast('Failed to read Excel file');
    }
  };

  const handleImport = async () => {
    if (!file) return;
    if (requireGroup && !selectedGroupId) {
      showErrorToast('Please select a contact group');
      return;
    }

    if (!columnMappings.name || !columnMappings.phone) {
      showErrorToast('Please map the required columns');
      return;
    }

    if (validationErrors.length > 0) {
      showErrorToast('Please fix validation errors before importing');
      return;
    }

    try {
      setLoading(true);
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
      const dataRows = jsonData.slice(skipHeader ? 1 : 0) as Array<Record<string, any>>;

      const contacts = dataRows.map((row: any) => ({
        name: String(row[columnMappings.name as string] || '').trim(),
        phone: String(row[columnMappings.phone as string] || '').replace(/\D/g, '')
      })).filter(contact => contact.name && contact.phone.length >= 10);

      await onImport(contacts, selectedGroupId || undefined);
      onClose();
    } catch (err) {
      console.error('Error importing contacts:', err);
      showErrorToast('Failed to import contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleColumnMappingChange = (column: string, value: string | null) => {
    setColumnMappings(prev => ({ ...prev, [column]: value }));
  };

  const handleSkipHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkipHeader(e.target.checked);
  };

  const handleSelectGroup = (group: ContactGroup) => {
    setSelectedGroupId(group.id);
  };

  const validateData = () => {
    if (!file || !columnMappings.name || !columnMappings.phone) return;

    try {
      const data = utils.sheet_to_json(read(file).Sheets[0], { header: 1 });
      const dataRows = data.slice(skipHeader ? 1 : 0) as Array<Record<string, any>>;

      const errors: string[] = [];
      dataRows.forEach((row, index) => {
        const name = row[columnMappings.name as string];
        const phone = row[columnMappings.phone as string];

        if (typeof name !== 'string' || !name.trim()) {
          errors.push(`Row ${index + 1}: Invalid name`);
        }
        if (typeof phone !== 'string' || !phone.replace(/\D/g, '').length) {
          errors.push(`Row ${index + 1}: Invalid phone number`);
        }
      });
      setValidationErrors(errors);
    } catch (err) {
      console.error('Error validating data:', err);
      setValidationErrors(['Failed to validate data']);
    }
  };

  React.useEffect(() => {
    validateData();
  }, [columnMappings, skipHeader, file]);

  const resetForm = () => {
    setFile(null);
    setPreviewData([]);
    setColumnHeaders([]);
    setColumnMappings({ name: null, phone: null, email: null, address: null, notes: null });
    setSkipHeader(false);
    setValidationErrors([]);
    if (!defaultGroupId) {
      setSelectedGroupId('');
    }
  };

  const isImportDisabled = !file || !columnMappings.name || !columnMappings.phone || validationErrors.length > 0 || loading;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {
        onClose();
        resetForm();
      }}
      title="Import Contacts from Excel"
    >
      <div className="p-6 space-y-6">
        {!file ? (
          <FileUploader onFileSelect={handleFileChange} fileTypes={['.xlsx', '.xls']} />
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Selected file: <span className="font-medium">{file.name}</span>
              </p>
              <button
                onClick={resetForm}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                Choose a different file
              </button>
            </div>

            {!defaultGroupId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Contact Group {requireGroup && <span className="text-red-500">*</span>}
                </label>
                <GroupSearchInput
                  value={selectedGroupId}
                  onChange={setSelectedGroupId}
                  onSelectGroup={handleSelectGroup}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="skipHeader"
                checked={skipHeader}
                onChange={handleSkipHeaderChange}
                className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700 dark:text-white dark:focus:ring-primary-400 h-4 w-4"
              />
              <label htmlFor="skipHeader" className="text-sm text-gray-700 dark:text-gray-300">
                Skip first row (header)
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <ColumnMappingDropdown
                label="Contact Name"
                headers={columnHeaders}
                value={columnMappings.name}
                onChange={(value) => handleColumnMappingChange('name', value)}
                required
              />
              <ColumnMappingDropdown
                label="Phone Number"
                headers={columnHeaders}
                value={columnMappings.phone}
                onChange={(value) => handleColumnMappingChange('phone', value)}
                required
              />
              <ColumnMappingDropdown
                label="Email"
                headers={columnHeaders}
                value={columnMappings.email}
                onChange={(value) => handleColumnMappingChange('email', value)}
              />
              <ColumnMappingDropdown
                label="Address"
                headers={columnHeaders}
                value={columnMappings.address}
                onChange={(value) => handleColumnMappingChange('address', value)}
              />
              <ColumnMappingDropdown
                label="Notes"
                headers={columnHeaders}
                value={columnMappings.notes}
                onChange={(value) => handleColumnMappingChange('notes', value)}
              />
            </div>

            <ImportPreview contacts={previewData} columnMappings={columnMappings} />

            {validationErrors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 p-4">
                {validationErrors.map((error, index) => (
                  <p key={index} className="text-sm text-red-700 dark:text-red-200">
                    {error}
                  </p>
                ))}
              </div>
            )}

            <button
              onClick={handleImport}
              disabled={isImportDisabled}
              className={cn(
                "w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md",
                "text-white bg-primary-600",
                "hover:bg-primary-700",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Import Contacts
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
