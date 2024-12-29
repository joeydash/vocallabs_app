import React, { useState } from 'react';
import { PricingModal } from '../components/pricing/PricingModal';
import { ChannelGrid } from '../components/inbox/ChannelGrid';
import { MessageSquare } from 'lucide-react';

export function Inbox() {
  const [showPricing, setShowPricing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-8 h-8 text-primary-500 dark:text-primary-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inbox</h1>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Available Channels
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Connect with your customers through their preferred communication channels. 
          Upgrade to Enterprise for access to all channels.
        </p>
        <ChannelGrid onChannelClick={() => setShowPricing(true)} />
      </div>

      <PricingModal 
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
      />
    </div>
  );
}
