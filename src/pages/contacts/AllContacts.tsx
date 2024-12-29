import React, { useState } from 'react';
import { useAllContacts } from '../../hooks/contacts/useAllContacts';
import { ContactsView } from '../../components/contacts/ContactsView';
import { ImportContactsModal } from '../../components/contacts/ImportContactsModal';

export function AllContacts() {
  const [showImportModal, setShowImportModal] = useState(false);
  const { 
    contacts, 
    loading, 
    error,
    page,
    totalPages,
    searchTerm,
    createContact,
    updateContact,
    deleteContact,
    deleteMultipleContacts,
    handleSearch,
    goToPage,
    refetch
  } = useAllContacts({ limit: 10 });

  const handleCreateContact = async (data: { name: string; phone: string; groupId?: string }) => {
    try {
      await createContact(data);
    } catch (err) {
      console.error('Failed to create contact:', err);
      throw err;
    }
  };

  const handleImportContacts = async (contacts: Array<{ name: string; phone: string }>, groupId?: string) => {
    try {
      // Create each contact individually with the selected group
      await Promise.all(
        contacts.map(contact => 
          createContact({
            name: contact.name,
            phone: contact.phone,
            groupId
          })
        )
      );
      
      // Refresh the contacts list
      await refetch();
      setShowImportModal(false);
    } catch (err) {
      console.error('Failed to import contacts:', err);
      throw err;
    }
  };

  return (
    <>
      <ContactsView
        title="All Contacts"
        contacts={contacts}
        loading={loading}
        error={error}
        page={page}
        totalPages={totalPages}
        searchTerm={searchTerm}
        onCreateContact={handleCreateContact}
        onImportContacts={() => setShowImportModal(true)}
        onUpdateContact={updateContact}
        onDeleteContact={deleteContact}
        onDeleteMultiple={deleteMultipleContacts}
        onPageChange={goToPage}
        onSearch={handleSearch}
        requireGroup={true}
      />

      <ImportContactsModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportContacts}
        requireGroup={true}
      />
    </>
  );
}
