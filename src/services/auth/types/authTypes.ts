export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  authToken: string | null;
}

export interface User {
  id: string;
  phone: string;
  fullname?: string;
  email?: string;
  dp?: string;
}

export interface LoginResponse {
  auth_token: string;
  id: string;
  status: string;
}

export interface OtpVerificationData {
  phone: string;
  otp: string;
}

export interface RegisterResponse {
  request_id: string;
  status: string;
}

export interface UserData {
  fullname: string | null;
  phone: string;
  email: string | null;
  dp: string | null;
}

export interface AuthContextInterface {
  isAuthenticated: boolean;
  user: User | null;
  authToken: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUserData: () => Promise<void>;
}
