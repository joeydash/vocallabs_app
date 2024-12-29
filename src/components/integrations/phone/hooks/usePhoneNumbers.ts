import { useState, useEffect } from 'react';
import { useAuth } from '../../../../services/auth';
import { createGraphQLClient } from '../../../../services/graphql/client';
import { phoneNumberQueries } from '../queries';
import { PhoneNumber } from '../types';
import { showSuccessToast, showErrorToast } from '../../../../utils/toast';

export function usePhoneNumbers(tokenId: string, service: 'plivo' | 'twilio') {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useAuth();

  const fetchPhoneNumbers = async () => {
    if (!authToken) return;

    try {
      setLoading(true);
      const client = createGraphQLClient(authToken);
      const data = await client.request(phoneNumberQueries.GET_PHONE_NUMBERS, { 
        token_id: tokenId 
      });
      setPhoneNumbers(data.vocallabs_token_phone_mapping);
      setError(null);
    } catch (err) {
      console.error('Error fetching phone numbers:', err);
      setError('Failed to fetch phone numbers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenId) {
      fetchPhoneNumbers();
    }
  }, [tokenId]);

  const addPhoneNumber = async (phone: string) => {
    if (!authToken) return;

    try {
      const client = createGraphQLClient(authToken);
      await client.request(phoneNumberQueries.ADD_PHONE_NUMBER, {
        token_id: tokenId,
        phone
      });
      
      showSuccessToast('Phone number added successfully');
      await fetchPhoneNumbers();
    } catch (err) {
      showErrorToast('Failed to add phone number');
      throw err;
    }
  };

  const deletePhoneNumber = async (id: string) => {
    if (!authToken) return;

    try {
      const client = createGraphQLClient(authToken);
      await client.request(phoneNumberQueries.DELETE_PHONE_NUMBER, { id });
      showSuccessToast('Phone number deleted successfully');
      await fetchPhoneNumbers();
    } catch (err) {
      showErrorToast('Failed to delete phone number');
      throw err;
    }
  };

  return {
    phoneNumbers,
    loading,
    error,
    addPhoneNumber,
    deletePhoneNumber
  };
}
