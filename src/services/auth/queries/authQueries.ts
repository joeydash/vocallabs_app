export const GET_USER_DATA = `
  query GetUserData($id: uuid!) {
    auth(where: {id: {_eq: $id}}) {
      id
      fullname
      phone
      email
      dp
    }
  }
`;

export const REGISTER = `
  mutation Register($phone: String!) {
    registerWithoutPassword(credentials: {phone: $phone}) {
      request_id
      status
    }
  }
`;

export const VERIFY_OTP = `
  mutation VerifyOTP($phone: String!, $otp: String!) {
    verifyOTP(request: {otp: $otp, phone: $phone}) {
      auth_token
      id
      status
    }
  }
`;
