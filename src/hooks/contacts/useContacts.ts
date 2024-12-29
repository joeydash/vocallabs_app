import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../services/auth';
import { createGraphQLClient } from '../../services/graphql/client';
import { Contact } from '../../types/contact';
import { GET_CONTACTS, CREATE_CONTACT, DELETE_CONTACT, DELETE_MULTIPLE_CONTACTS } from '../../services/contacts/queries';
import { useDebounce } from '../useDebounce';
import { showErrorToast } from '../../utils/toast';

interface UseContactsOptions {
  limit?: number;
  initialPage?: number;
}

interface ContactsState {
  contacts: Contact[];
  totalCount: number;
  loading: boolean;
  error: string | null;
}

export function useContacts(groupId?: string, { limit = 10, initialPage = 1 }: UseContactsOptions = {}) {
  const [state, setState] = useState<ContactsState>({
    contacts: [],
    totalCount: 0,
    loading: true,
    error: null,
  });
  const [page, setPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, authToken } = useAuth();

  const fetchContacts = useCallback(async (currentPage: number, search: string = '') => {
    if (!user?.id || !authToken) return;

    try {
      setState(prev => ({ ...prev, loading: true }));
      const client = createGraphQLClient(authToken);
      const offset = (currentPage - 1) * limit;
      
      const searchPattern = search ? `%${search}%` : '%';

      const data = await client.request(GET_CONTACTS, {
        groupId,
        clientId: user.id,
        limit,
        offset,
        search: searchPattern,
      });

      setState({
        contacts: data.vocallabs_prospects,
        totalCount: data.vocallabs_prospects_aggregate.aggregate.count,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch contacts',
        loading: false,
      }));
      console.error('Error fetching contacts:', err);
    }
  }, [user?.id, authToken, limit, groupId]);

  const debouncedSearch = useCallback(
    useDebounce((search: string) => {
      fetchContacts(1, search);
    }, 300),
    [fetchContacts]
  );

  useEffect(() => {
    if (!user?.id) return;

    if (!searchTerm) {
      fetchContacts(page, searchTerm);
    }
  }, [user?.id, page, fetchContacts, searchTerm]);

  useEffect(() => {
    if (!user?.id) return;

    if (searchTerm) {
      setPage(1);
      debouncedSearch(searchTerm);
    }
  }, [user?.id, searchTerm, debouncedSearch]);

  const createContact = async (data: { name: string; phone: string; groupId?: string }) => {
    if (!user?.id || !authToken) return;

    try {
      const client = createGraphQLClient(authToken);
      await client.request(CREATE_CONTACT, {
        input: {
          name: data.name,
          phone: data.phone,
          client_id: user.id,
          prospect_group_id: data.groupId || groupId,
        },
      });
      await fetchContacts(page, searchTerm);
    } catch (err) {
      showErrorToast('Failed to create contact');
      throw err;
    }
  };

  const deleteContact = async (id: string) => {
    if (!authToken) return;

    try {
      const client = createGraphQLClient(authToken);
      await client.request(DELETE_CONTACT, { id });
      await fetchContacts(page, searchTerm);
    } catch (err) {
      showErrorToast('Failed to delete contact');
      throw err;
    }
  };

  const deleteMultipleContacts = async (ids: string[]) => {
    if (!authToken) return;

    try {
      const client = createGraphQLClient(authToken);
      await client.request(DELETE_MULTIPLE_CONTACTS, { ids });
      await fetchContacts(page, searchTerm);
    } catch (err) {
      showErrorToast('Failed to delete contacts');
      throw err;
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const totalPages = Math.ceil(state.totalCount / limit);

  return {
    ...state,
    page,
    totalPages,
    searchTerm,
    createContact,
    deleteContact,
    deleteMultipleContacts,
    handleSearch,
    goToPage: setPage,
    refetch: () => fetchContacts(page, searchTerm),
  };
}
