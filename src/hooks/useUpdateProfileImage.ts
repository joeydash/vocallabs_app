import { useState } from 'react';
import { createGraphQLClient } from '../services/graphql/client';
import { useAuth } from '../services/auth';

const UPDATE_PROFILE_IMAGE = `
  mutation UpdateProfileImage($image: String!, $user_id: String!) {
    changeDp(request: {image: $image, user_id: $user_id}) {
      dp
    }
  }
`;

interface UpdateProfileImageData {
  user_id: string;
  image: string;
}

export function useUpdateProfileImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authToken, updateUserData } = useAuth();

  const updateProfileImage = async (data: UpdateProfileImageData) => {
    if (!authToken) return;

    try {
      setLoading(true);
      setError(null);
      const client = createGraphQLClient(authToken);
      
      await client.request(UPDATE_PROFILE_IMAGE, data);
      await updateUserData();
    } catch (err) {
      setError('Failed to update profile image');
      console.error('Error updating profile image:', err);
    } finally {
      setLoading(false);
    }
  };

  return { updateProfileImage, loading, error };
}
