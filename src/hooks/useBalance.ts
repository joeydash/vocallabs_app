import { useState, useEffect } from 'react';
import { createGrowClient } from '../services/api/graphqlClient';
import { useAuth } from '../services/auth';

const BALANCE_QUERY = `
  query GetBalance($user_id: uuid = "") {
    whatsub_user_wallet_locked_unlocked_internal(where: {user_id: {_eq: $user_id}}) {
      unlocked_amount
    }
  }
`;

export function useBalance() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, authToken } = useAuth();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user?.id || !authToken) return;

      try {
        setLoading(true);
        const client = createGrowClient(authToken);
        const data = await client.request(BALANCE_QUERY, { user_id: user.id });
        
        const balanceData = data.whatsub_user_wallet_locked_unlocked_internal[0];
        setBalance(balanceData?.unlocked_amount || 0);
        setError(null);
      } catch (err) {
        console.error('Error fetching balance:', err);
        setError('Failed to fetch balance');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    
    // Refresh balance every 5 minutes
    const interval = setInterval(fetchBalance, 300000);
    return () => clearInterval(interval);
  }, [user?.id, authToken]);

  return { balance, loading, error };
}
