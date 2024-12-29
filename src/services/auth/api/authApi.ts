import { createGrowClient } from '../../api/graphqlClient';
import { GET_USER_DATA, REGISTER, VERIFY_OTP } from '../queries/authQueries';
import { OtpVerificationData, LoginResponse, RegisterResponse, UserData } from '../types/authTypes';

export class AuthApi {
  private client;

  constructor() {
    this.client = createGrowClient();
  }

  async sendOTP(phone: string): Promise<RegisterResponse> {
    const response = await this.client.request(REGISTER, { phone });
    return response.registerWithoutPassword;
  }

  async verifyOTP(data: OtpVerificationData): Promise<LoginResponse> {
    const response = await this.client.request(VERIFY_OTP, data);
    return response.verifyOTP;
  }

  async getUserData(id: string, authToken: string): Promise<UserData | null> {
    const client = createGrowClient(authToken);
    const response = await client.request(GET_USER_DATA, { id });
    return response.auth[0] || null;
  }
}

export const authApi = new AuthApi();
