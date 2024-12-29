import React, { useState } from 'react';
import { Contact } from '../../types/contact';
import { formatDate, formatPhoneNumber } from '../../utils/formatters';
import { User, Phone, Calendar, FolderOpen, Edit2, Trash2, CheckSquare, Square, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContactTimelineSidebar } from './ContactTimelineSidebar';

interface ContactsTableProps {
  contacts: Contact[];
  onAddContact: () => void;
  onImportContacts: (contacts: Array<{ name: string; phone: string }>) => Promise<void>;
  onEditContact?: (contact: Contact) => void;
  onDeleteContact?: (id: string) => void;
  onDeleteMultiple?: (ids: string[]) => Promise<void>;
  AddContactButton: React.ComponentType;
}

export function ContactsTable({ 
  contacts, 
  onAddContact,
  onEditContact, 
  onDeleteContact,
  onDeleteMultiple,
  AddContactButton
}: ContactsTableProps) {
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);

  const toggleSelectAll = () => {
    if (selectedContacts.size === contacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(contacts.map(contact => contact.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedContacts(newSelected);
  };

  const handleBulkDelete = async () => {
    if (onDeleteMultiple && selectedContacts.size > 0 && !isDeleting) {
      try {
        setIsDeleting(true);
        await onDeleteMultiple(Array.from(selectedContacts));
        setSelectedContacts(new Set());
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6">
            <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Contacts Yet
          </h3>
          
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Start building your contact list by adding your first contact. Organize and manage your contacts efficiently for better campaign management.
          </p>

          <AddContactButton />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {selectedContacts.size > 0 && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {selectedContacts.size} contact{selectedContacts.size > 1 ? 's' : ''} selected
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
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={toggleSelectAll}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                  >
                    {selectedContacts.size === contacts.length ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleSelect(contact.id)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                    >
                      {selectedContacts.has(contact.id) ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {contact.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Phone className="h-4 w-4 mr-2" />
                      {formatPhoneNumber(contact.phone)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      <FolderOpen className="h-4 w-4 mr-2 text-gray-400" />
                      {contact.prospect_group ? (
                        <Link 
                          to={`/contacts/groups/${contact.prospect_group.id}`}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                        >
                          {contact.prospect_group.name}
                        </Link>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">No Group</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(contact.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(contact.updated_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          setSelectedContact(contact);
                          setShowTimeline(true);
                        }}
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        title="View call history"
                      >
                        <History className="h-4 w-4" />
                      </button>
                      {onEditContact && (
                        <button
                          onClick={() => onEditContact(contact)}
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                          title="Edit contact"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                      {onDeleteContact && (
                        <button
                          onClick={() => onDeleteContact(contact.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete contact"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ContactTimelineSidebar
        isOpen={showTimeline}
        onClose={() => {
          setShowTimeline(false);
          setSelectedContact(null);
        }}
        contact={selectedContact}
      />
    </>
  );
}
