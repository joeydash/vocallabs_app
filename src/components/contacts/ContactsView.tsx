import React, { useState } from 'react';
import { Contact } from '../../types/contact';
import { ContactsTable } from './ContactsTable';
import { CreateContactModal } from './CreateContactModal';
import { SearchBar } from './SearchBar';
import { Users, Plus, FileSpreadsheet } from 'lucide-react';
import { Pagination } from '../shared/Pagination';
import { cn } from '../../utils/cn';

interface ContactsViewProps {
  title: string;
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  searchTerm: string;
  onCreateContact: (data: { name: string; phone: string; groupId?: string }) => Promise<void>;
  onImportContacts: (contacts: Array<{ name: string; phone: string }>) => Promise<void>;
  onUpdateContact?: (id: string, data: { name: string; phone: string }) => Promise<void>;
  onDeleteContact?: (id: string) => Promise<void>;
  onDeleteMultiple?: (ids: string[]) => Promise<void>;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  groupId?: string;
  requireGroup?: boolean;
}

export function ContactsView({
  title,
  contacts,
  loading,
  error,
  page,
  totalPages,
  searchTerm,
  onCreateContact,
  onImportContacts,
  onUpdateContact,
  onDeleteContact,
  onDeleteMultiple,
  onPageChange,
  onSearch,
  groupId,
  requireGroup = true,
}: ContactsViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateContact = async (data: { name: string; phone: string; groupId?: string }) => {
    try {
      await onCreateContact(data);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create contact:', err);
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setShowCreateModal(true);
  };

  const handleDeleteContact = async (id: string) => {
    if (!onDeleteContact || isDeleting) return;

    try {
      setIsDeleting(true);
      await onDeleteContact(id);
    } catch (err) {
      console.error('Failed to delete contact:', err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteMultiple = async (ids: string[]) => {
    if (!onDeleteMultiple || isDeleting || ids.length === 0) return;

    try {
      setIsDeleting(true);
      await onDeleteMultiple(ids);
    } catch (err) {
      console.error('Failed to delete contacts:', err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  const AddContactButton = () => (
    <div className="flex items-center space-x-3">
      <button
        onClick={() => setShowCreateModal(true)}
        className={cn(
          "inline-flex items-center px-4 py-2 text-sm font-medium rounded-md",
          "text-white bg-primary-600",
          "hover:bg-primary-700",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
          "transition-colors duration-200"
        )}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Contact
      </button>

      <button
        onClick={() => onImportContacts([])}
        className={cn(
          "inline-flex items-center px-4 py-2 text-sm font-medium rounded-md",
          "text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300",
          "border border-gray-300 dark:border-gray-600",
          "hover:bg-gray-50 dark:hover:bg-gray-700",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
          "transition-colors duration-200"
        )}
      >
        <FileSpreadsheet className="w-4 h-4 mr-2" />
        Import from Excel
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-primary-500 dark:text-primary-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        </div>
        {contacts.length > 0 && <AddContactButton />}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      <SearchBar
        value={searchTerm}
        onChange={onSearch}
        loading={loading}
        placeholder="Search contacts by name or phone..."
        className="max-w-2xl"
      />

      <ContactsTable 
        contacts={contacts}
        onAddContact={() => {
          setEditingContact(null);
          setShowCreateModal(true);
        }}
        onEditContact={onUpdateContact ? handleEditContact : undefined}
        onDeleteContact={onDeleteContact ? handleDeleteContact : undefined}
        onDeleteMultiple={onDeleteMultiple ? handleDeleteMultiple : undefined}
        onImportContacts={onImportContacts}
        AddContactButton={AddContactButton}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
      
      <CreateContactModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingContact(null);
        }}
        onSubmit={handleCreateContact}
        initialData={editingContact}
        defaultGroupId={groupId}
        requireGroup={requireGroup}
      />
    </div>
  );
}
