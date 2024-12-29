import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth/hooks/useAuth';
import { authApi } from '../../services/auth/api/authApi';
import { LoginForm } from '../../components/auth/LoginForm';
import { OtpForm } from '../../components/auth/OtpForm';
import { LoginBanner } from '../../components/auth/LoginBanner';
import { ThemeToggle } from '../../components/auth/ThemeToggle';

export function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.sendOTP(phone);
      if (response.status === 'success') {
        setIsOtpSent(true);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.verifyOTP({ phone, otp });
      if (response.status === 'success') {
        login(response.auth_token, { id: response.id, phone });
        navigate('/', { replace: true });
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginBanner />

      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center">
            <div className="w-full flex justify-end mb-4">
              <ThemeToggle />
            </div>
            <div className="md:hidden mb-8">
              <img 
                src="https://cdn.subspace.money/grow90_tracks/images/qMKYWTC7Qb6pny3lzL7P.png"
                alt="Logo"
                className="h-8 mx-auto block dark:hidden"
              />
              <img 
                src="https://cdn.subspace.money/grow90_tracks/images/FGvzvKGIy0z7DRBW673v.png"
                alt="Logo"
                className="h-8 mx-auto hidden dark:block"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
              {isOtpSent ? 'Enter Verification Code' : 'Sign in to your account'}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
              {isOtpSent 
                ? 'We sent a verification code to your phone'
                : 'Enter your phone number to get started'
              }
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 p-4 rounded">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}

          {!isOtpSent ? (
            <LoginForm
              phone={phone}
              loading={loading}
              onPhoneChange={setPhone}
              onSubmit={handleSendOTP}
            />
          ) : (
            <OtpForm
              otp={otp}
              loading={loading}
              onOtpChange={setOtp}
              onSubmit={handleVerifyOTP}
              onBack={() => setIsOtpSent(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
