export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  highlight?: boolean;
  features: string[];
  creditsPerMonth: number;
  premiumAudioCost: number;
  standardAudioCost: number;
  agents: number | string;
  support: string;
  omnichannel: boolean;
}

export const pricingTiers = [
  {
    name: 'Basic',
    price: '₹2,999',
    period: '/month',
    description: 'Great for small businesses',
    features: [
      '3,000 monthly credits',
      'Enhanced voice quality',
      'Chat support',
      'Advanced analytics',
      'API access'
    ],
    creditsPerMonth: 3000,
    premiumAudioCost: 7,
    standardAudioCost: 5,
    agents: 25,
    support: 'Chat',
    omnichannel: false
  },
  {
    name: 'Professional',
    price: '₹9,999',
    period: '/month',
    description: 'Perfect for growing teams',
    highlight: true,
    features: [
      '10,000 monthly credits',
      'Premium voice quality',
      'Priority chat support',
      'Advanced analytics & reporting',
      'Full API access',
      'Omnichannel support',
      'Custom integrations'
    ],
    creditsPerMonth: 10000,
    premiumAudioCost: 6,
    standardAudioCost: 4,
    agents: 125,
    support: 'Chat',
    omnichannel: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: [
      'Unlimited monthly credits',
      'Highest voice quality',
      'Dedicated support',
      'Custom analytics',
      'Full API access',
      'Omnichannel support',
      'Custom development',
      'SLA guarantees',
      'On-premise deployment'
    ],
    creditsPerMonth: 100000,
    premiumAudioCost: 5,
    standardAudioCost: 3,
    agents: 'Unlimited',
    support: 'Dedicated',
    omnichannel: true
  }
] as const;
