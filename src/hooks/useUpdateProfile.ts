import { useState } from 'react';
import { createGraphQLClient } from '../services/graphql/client';
import { useAuth } from '../services/auth';

const UPDATE_PROFILE = `
  mutation UpdateProfile($id: uuid!, $fullname: String, $email: String) {
    update_auth_by_pk(
      pk_columns: { id: $id }
      _set: { fullname: $fullname, email: $email }
    ) {
      id
      fullname
      email
    }
  }
`;

interface UpdateProfileData {
  id: string;
  fullname?: string;
  email?: string;
}

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authToken, updateUserData } = useAuth();

  const updateProfile = async (data: UpdateProfileData) => {
    if (!authToken) return false;

    try {
      setLoading(true);
      setError(null);
      const client = createGraphQLClient(authToken);
      
      await client.request(UPDATE_PROFILE, data);
      await updateUserData();
      return true;
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error };
}
