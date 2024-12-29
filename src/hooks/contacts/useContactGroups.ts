import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../services/auth';
import { ContactGroup } from '../../types/contact';
import { groupsApi } from '../../services/contacts/api/groupsApi';
import { showErrorToast } from '../../utils/toast';

interface UseContactGroupsState {
  groups: ContactGroup[];
  loading: boolean;
  error: string | null;
}

export function useContactGroups() {
  const [state, setState] = useState<UseContactGroupsState>({
    groups: [],
    loading: true,
    error: null,
  });
  const { user, authToken } = useAuth();
  const fetchInProgress = useRef(false);

  const fetchGroups = useCallback(async () => {
    if (!user?.id || !authToken || fetchInProgress.current) return;

    try {
      fetchInProgress.current = true;
      setState(prev => ({ ...prev, loading: true }));
      const groups = await groupsApi.getGroups(user.id, authToken);
      setState({
        groups,
        loading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = 'Failed to fetch contact groups';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      showErrorToast(errorMessage);
    } finally {
      fetchInProgress.current = false;
    }
  }, [user?.id, authToken]);

  const createGroup = async (name: string) => {
    if (!user?.id || !authToken) return;

    try {
      const newGroup = await groupsApi.createGroup(name, user.id, authToken);
      setState(prev => ({
        ...prev,
        groups: [...prev.groups, newGroup],
      }));
      return newGroup;
    } catch (err) {
      showErrorToast('Failed to create contact group');
      throw err;
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchGroups();
    }
    
    return () => {
      fetchInProgress.current = false;
    };
  }, [user?.id, fetchGroups]);

  return { 
    ...state, 
    createGroup, 
    refetch: fetchGroups 
  };
}
