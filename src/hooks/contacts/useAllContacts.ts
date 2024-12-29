import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../services/auth';
import { createGraphQLClient } from '../../services/graphql/client';
import { Contact } from '../../types/contact';
import { GET_ALL_CONTACTS, CREATE_CONTACT, UPDATE_CONTACT, DELETE_CONTACT, DELETE_MULTIPLE_CONTACTS } from '../../services/contacts/queries';
import { useDebounce } from '../useDebounce';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

interface UseAllContactsOptions {
  limit?: number;
  initialPage?: number;
}

interface ContactsState {
  contacts: Contact[];
  totalCount: number;
  loading: boolean;
  error: string | null;
}

export function useAllContacts({ limit = 10, initialPage = 1 }: UseAllContactsOptions = {}) {
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

      const data = await client.request(GET_ALL_CONTACTS, {
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
  }, [user?.id, authToken, limit]);

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
          prospect_group_id: data.groupId,
        },
      });
      await fetchContacts(page, searchTerm);
      showSuccessToast('Contact created successfully');
    } catch (err) {
      showErrorToast('Failed to create contact');
      throw err;
    }
  };

  const updateContact = async (id: string, data: { name: string; phone: string }) => {
    if (!authToken) return;

    try {
      const client = createGraphQLClient(authToken);
      await client.request(UPDATE_CONTACT, {
        id,
        name: data.name,
        phone: data.phone,
      });
      await fetchContacts(page, searchTerm);
      showSuccessToast('Contact updated successfully');
    } catch (err) {
      showErrorToast('Failed to update contact');
      throw err;
    }
  };

  const deleteContact = async (id: string) => {
    if (!authToken) return;

    try {
      const client = createGraphQLClient(authToken);
      await client.request(DELETE_CONTACT, { id });
      await fetchContacts(page, searchTerm);
      showSuccessToast('Contact deleted successfully');
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
      showSuccessToast('Contacts deleted successfully');
    } catch (err) {
      showErrorToast('Failed to delete contacts');
      throw err;
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return {
    ...state,
    page,
    totalPages: Math.ceil(state.totalCount / limit),
    searchTerm,
    createContact,
    updateContact,
    deleteContact,
    deleteMultipleContacts,
    handleSearch,
    goToPage: setPage,
    refetch: () => fetchContacts(page, searchTerm),
  };
}
