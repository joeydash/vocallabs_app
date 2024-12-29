import React from 'react';
import { Check, Bot, Zap, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';
import { PricingTier } from './types';
import { generateWhatsAppLink } from '../../utils/whatsapp';

interface PricingTierCardProps {
  tier: PricingTier;
}

export function PricingTierCard({ tier }: PricingTierCardProps) {
  const whatsappMessage = `Hi, I'm interested in the ${tier.name} plan. Can you help me get started?`;
  const whatsappLink = generateWhatsAppLink(whatsappMessage);

  return (
    <div
      className={cn(
        "relative bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-all duration-200",
        "border hover:border-primary-300 dark:hover:border-primary-600",
        tier.highlight
          ? "border-primary-500 dark:border-primary-400 scale-[1.02] shadow-lg ring-1 ring-primary-500 dark:ring-primary-400"
          : "border-gray-200 dark:border-gray-700"
      )}
    >
      {tier.highlight && (
        <div className="absolute -top-3 inset-x-0 flex justify-center">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-primary-700 bg-primary-100 dark:bg-primary-900/50 dark:text-primary-300 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {tier.name}
          </h3>
          <div className="mt-2 flex items-baseline justify-center gap-x-2">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {tier.price}
            </span>
            {tier.period && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {tier.period}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {tier.description}
          </p>
        </div>

        {/* Key Features */}
        <div className="space-y-3 mt-6 mb-6">
          <div className="flex items-center gap-x-2">
            <Bot className="w-4 h-4 text-primary-500 dark:text-primary-400 flex-shrink-0" />
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {tier.agents} agents included
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <Zap className="w-4 h-4 text-primary-500 dark:text-primary-400 flex-shrink-0" />
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {tier.creditsPerMonth.toLocaleString()} credits/month
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <Clock className="w-4 h-4 text-primary-500 dark:text-primary-400 flex-shrink-0" />
            <span className="text-xs text-gray-700 dark:text-gray-300">
              ₹{tier.standardAudioCost}/min standard audio
            </span>
          </div>
        </div>

        {/* Feature List */}
        <ul className="space-y-2.5 mt-6 mb-6">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-start gap-x-2">
              <Check className="w-4 h-4 text-primary-500 dark:text-primary-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "block w-full text-center py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200",
            tier.highlight
              ? "bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
          )}
        >
          {tier.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
        </a>
      </div>
    </div>
  );
}
