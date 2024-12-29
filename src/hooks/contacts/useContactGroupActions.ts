import { useState } from 'react';
import { useAuth } from '../../services/auth';
import { contactGroupsApi } from '../../services/contacts/api/contactGroupsApi';
import { ContactGroup } from '../../types/contact';

export function useContactGroupActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useAuth();

  const updateGroup = async (id: string, name: string) => {
    if (!authToken) return;

    try {
      setLoading(true);
      setError(null);
      await contactGroupsApi.updateGroup(id, name, authToken);
    } catch (err) {
      setError('Failed to update group');
      console.error('Error updating group:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (id: string) => {
    if (!authToken) return;

    try {
      setLoading(true);
      setError(null);
      await contactGroupsApi.deleteGroup(id, authToken);
    } catch (err) {
      setError('Failed to delete group');
      console.error('Error deleting group:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateGroup, deleteGroup, loading, error };
}
