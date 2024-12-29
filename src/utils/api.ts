import { createGraphQLClient } from '../services/graphql/client';

export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const createAuthenticatedClient = (authToken: string | null) => {
  if (!authToken) {
    throw new Error('Authentication token is required');
  }
  return createGraphQLClient(authToken);
};

export const handleApiResponse = async <T>(
  promise: Promise<T>,
  errorMessage: string = 'Operation failed'
): Promise<T> => {
  try {
    return await promise;
  } catch (error) {
    console.error(error);
    throw new Error(errorMessage);
  }
};
