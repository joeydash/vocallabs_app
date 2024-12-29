import React, { useState } from 'react';
import { useContactGroups } from '../../hooks/contacts/useContactGroups';
import { useContactGroupActions } from '../../hooks/contacts/useContactGroupActions';
import { GroupCard } from '../../components/contacts/GroupCard';
import { CreateGroupModal } from '../../components/contacts/CreateGroupModal';
import { EditGroupModal } from '../../components/contacts/EditGroupModal';
import { EmptyState } from '../../components/contacts/EmptyState';
import { Users, Plus } from 'lucide-react';
import { ContactGroup } from '../../types/contact';
import { showSuccessToast, showErrorToast, showLoadingToast, updateToast } from '../../utils/toast';

export function ContactGroups() {
  const { groups, loading: groupsLoading, error: groupsError, createGroup, refetch } = useContactGroups();
  const { updateGroup, deleteGroup, loading: actionLoading, error: actionError } = useContactGroupActions();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ContactGroup | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateGroup = async (name: string) => {
    const toastId = showLoadingToast('Creating group...');
    try {
      await createGroup(name);
      updateToast(toastId, 'success', 'Group created successfully');
      setShowCreateModal(false);
    } catch (err) {
      updateToast(toastId, 'error', 'Failed to create group');
    }
  };

  const handleEdit = (group: ContactGroup) => {
    setSelectedGroup(group);
    setShowEditModal(true);
  };

  const handleUpdate = async (id: string, name: string) => {
    const toastId = showLoadingToast('Updating group...');
    try {
      await updateGroup(id, name);
      updateToast(toastId, 'success', 'Group updated successfully');
      setShowEditModal(false);
      refetch();
    } catch (err) {
      updateToast(toastId, 'error', 'Failed to update group');
    }
  };

  const handleDelete = async (id: string) => {
    if (isDeleting) return;

    const toastId = showLoadingToast('Deleting group...');
    try {
      setIsDeleting(true);
      await deleteGroup(id);
      updateToast(toastId, 'success', 'Group deleted successfully');
      await refetch();
    } catch (err) {
      updateToast(toastId, 'error', 'Failed to delete group');
    } finally {
      setIsDeleting(false);
    }
  };

  if (groupsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-primary-500 dark:text-primary-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Groups</h1>
        </div>
        {groups.length > 0 && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </button>
        )}
      </div>

      {(groupsError || actionError) && (
        <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700 dark:text-red-200">
            {groupsError || actionError}
          </p>
        </div>
      )}

      {groups.length === 0 ? (
        <EmptyState
          title="No Contact Groups Yet"
          description="Create your first contact group to start organizing your contacts efficiently. Groups help you manage and segment your contact list for better campaign management."
          buttonText="Create First Group"
          onAction={() => setShowCreateModal(true)}
          icon={Users}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <GroupCard 
              key={group.id} 
              group={group}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateGroup}
      />

      {selectedGroup && (
        <EditGroupModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedGroup(null);
          }}
          onSubmit={handleUpdate}
          group={selectedGroup}
          loading={actionLoading}
          error={actionError}
        />
      )}
    </div>
  );
}
