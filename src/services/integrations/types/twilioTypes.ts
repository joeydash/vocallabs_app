export interface TwilioCredential {
  id: string;
  name: string;
  token: {
    auth_id: string;
    auth_token: string;
  };
}

export interface TwilioCredentialInput {
  name: string;
  auth_id: string;
  auth_token: string;
}
