import React from 'react';
import { useBalance } from '../../hooks/useBalance';
import { WalletMenu } from './WalletMenu';

export function BalanceDisplay() {
  const { balance, loading } = useBalance();

  if (loading) {
    return (
      <div className="h-8 w-24 bg-primary-50 dark:bg-primary-900/30 rounded-lg animate-pulse" />
    );
  }

  return <WalletMenu balance={balance} />;
}
