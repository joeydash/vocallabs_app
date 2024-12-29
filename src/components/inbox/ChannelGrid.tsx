import React from 'react';
import { ChannelCard } from './ChannelCard';

interface ChannelGridProps {
  onChannelClick: () => void;
}

export function ChannelGrid({ onChannelClick }: ChannelGridProps) {
  const channels = [
    {
      name: 'Website',
      icon: 'https://chatwoot.subspace.money/assets/images/dashboard/channels/website.png'
    },
    {
      name: 'WhatsApp',
      icon: 'https://chatwoot.subspace.money/assets/images/dashboard/channels/whatsapp.png'
    },
    {
      name: 'Email',
      icon: 'https://chatwoot.subspace.money/assets/images/dashboard/channels/email.png'
    },
    {
      name: 'API',
      icon: 'https://chatwoot.subspace.money/assets/images/dashboard/channels/api.png'
    },
    {
      name: 'Telegram',
      icon: 'https://chatwoot.subspace.money/assets/images/dashboard/channels/telegram.png'
    },
    {
      name: 'Line',
      icon: 'https://chatwoot.subspace.money/assets/images/dashboard/channels/line.png'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {channels.map((channel) => (
        <ChannelCard
          key={channel.name}
          name={channel.name}
          icon={channel.icon}
          onClick={onChannelClick}
        />
      ))}
    </div>
  );
}
