import React from 'react';
import { Check, Bot, MessageSquare, Headphones, Users, Clock, Zap } from 'lucide-react';
import { cn } from '../../utils/cn';
import { generateWhatsAppLink } from '../../utils/whatsapp';

interface PricingTier {
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

const pricingTiers: PricingTier[] = [
  {
    name: 'Freemium',
    price: '₹0',
    period: '/month',
    description: 'Perfect for trying out our services',
    features: [
      'Basic voice calling features',
      'Standard audio quality',
      'Email support',
      'Basic analytics',
      'Single channel support'
    ],
    creditsPerMonth: 0,
    premiumAudioCost: 7,
    standardAudioCost: 5,
    agents: 5,
    support: 'Email',
    omnichannel: false
  },
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
];

export function PricingPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Choose the perfect plan for your business. All plans include core features with flexible pricing options.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
            <Bot className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            AI-Powered Agents
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Intelligent voice agents that understand context and provide natural conversations.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
            <Headphones className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Premium Voice Quality
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Crystal clear audio with advanced noise reduction and natural voice synthesis.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Omnichannel Support
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with customers across multiple channels seamlessly.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pricingTiers.map((tier) => {
          const whatsappMessage = `Hi, I'm interested in the ${tier.name} plan. Can you help me get started?`;
          const whatsappLink = generateWhatsAppLink(whatsappMessage);

          return (
            <div
              key={tier.name}
              className={cn(
                "relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border transition-all duration-200",
                tier.highlight
                  ? "border-primary-500 dark:border-primary-400 scale-105 shadow-xl z-10"
                  : "border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-xl"
              )}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        {tier.period}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tier.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {tier.agents} agents included
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {tier.creditsPerMonth.toLocaleString()} credits/month
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      ₹{tier.standardAudioCost}/min standard audio
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="w-5 h-5 text-primary-500 dark:text-primary-400 flex-shrink-0 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "block w-full text-center py-2.5 px-4 rounded-lg font-medium transition-colors duration-200",
                    tier.highlight
                      ? "bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  )}
                >
                  {tier.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="mt-24">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              What are credits?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Credits are used for voice calls and other platform features. Each minute of standard audio costs 5 credits, while premium audio costs 7 credits.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Can I upgrade anytime?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Yes, you can upgrade your plan at any time. Your new features and credits will be available immediately after upgrading.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              What happens if I run out of credits?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You can purchase additional credits at any time. We'll notify you when your credits are running low to ensure uninterrupted service.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Do unused credits roll over?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Credits expire at the end of each billing cycle. We recommend choosing a plan that matches your expected usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
