import { useState, useCallback } from 'react';
import { Contact } from '../../types/contact';
import { useAuth } from '../../services/auth';
import { createGraphQLClient } from '../../services/graphql/client';

const CHECK_CONTACT = `
  query CheckContact($phone: String!, $clientId: uuid!) {
    vocallabs_prospects(
      where: {
        phone: { _eq: $phone },
        client_id: { _eq: $clientId }
      }
      limit: 1
    ) {
      id
      name
      phone
    }
  }
`;

export function useContactCheck() {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, authToken } = useAuth();

  const checkContact = useCallback(async (phone: string) => {
    if (!user?.id || !authToken) return null;
    
    try {
      setLoading(true);
      setError(null);
      const client = createGraphQLClient(authToken);
      const { vocallabs_prospects } = await client.request(CHECK_CONTACT, {
        phone,
        clientId: user.id
      });
      setContact(vocallabs_prospects[0] || null);
    } catch (err) {
      console.error('Error checking contact:', err);
      setError('Failed to check contact');
      setContact(null);
    } finally {
      setLoading(false);
    }
  }, [user?.id, authToken]);

  return {
    contact,
    loading,
    error,
    checkContact
  };
}
