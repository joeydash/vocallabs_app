import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useContacts } from '../../hooks/contacts/useContacts';
import { ContactsView } from '../../components/contacts/ContactsView';
import { ImportContactsModal } from '../../components/contacts/ImportContactsModal';
import { createGraphQLClient } from '../../services/graphql/client';
import { useAuth } from '../../services/auth';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

export function ContactList() {
  const { groupId } = useParams<{ groupId: string }>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const { user, authToken } = useAuth();
  const { 
    contacts, 
    loading, 
    error, 
    page,
    totalPages,
    searchTerm,
    goToPage,
    handleSearch,
    createContact, 
    deleteContact,
    deleteMultipleContacts,
    refetch
  } = useContacts(groupId, { limit: 10 });

  if (!groupId) return null;

  const handleCreateContact = async (data: { name: string; phone: string }) => {
    try {
      await createContact({ ...data, groupId });
    } catch (err) {
      console.error('Failed to create contact:', err);
      throw err;
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteContact(id);
      await refetch();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteMultiple = async (ids: string[]) => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteMultipleContacts(ids);
      await refetch();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImportContacts = async (contacts: Array<{ name: string; phone: string }>) => {
    if (!user?.id || !authToken) return;

    try {
      const client = createGraphQLClient(authToken);
      const objects = contacts.map(contact => ({
        name: contact.name,
        phone: contact.phone,
        client_id: user.id,
        prospect_group_id: groupId
      }));

      await client.request(`
        mutation ImportContacts($objects: [vocallabs_prospects_insert_input!]!) {
          insert_vocallabs_prospects(
            objects: $objects,
            on_conflict: {
              constraint: prospects_client_id_prospect_group_id_phone_key,
              update_columns: [name]
            }
          ) {
            affected_rows
          }
        }
      `, { objects });

      showSuccessToast(`Successfully imported ${contacts.length} contacts`);
      refetch();
    } catch (err) {
      console.error('Failed to import contacts:', err);
      showErrorToast('Failed to import contacts');
      throw err;
    }
  };

  return (
    <>
      <ContactsView
        title="Group Contacts"
        contacts={contacts}
        loading={loading}
        error={error}
        page={page}
        totalPages={totalPages}
        searchTerm={searchTerm}
        onCreateContact={handleCreateContact}
        onDeleteContact={handleDeleteContact}
        onDeleteMultiple={handleDeleteMultiple}
        onPageChange={goToPage}
        onSearch={handleSearch}
        onImportContacts={() => setShowImportModal(true)}
        groupId={groupId}
      />

      <ImportContactsModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportContacts}
        groupId={groupId}
      />
    </>
  );
}
