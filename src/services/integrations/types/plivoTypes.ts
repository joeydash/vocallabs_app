export interface PlivoCredential {
  id: string;
  name: string;
  token: {
    auth_id: string;
    auth_token: string;
  };
}

export interface PlivoCredentialInput {
  name: string;
  auth_id: string;
  auth_token: string;
}
