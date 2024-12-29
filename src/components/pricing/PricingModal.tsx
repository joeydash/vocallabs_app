import React from 'react';
import { Modal } from '../shared/Modal';
import { PricingTierCard } from './PricingTierCard';
import { PricingFAQSection } from './PricingFAQSection';
import { pricingTiers } from './types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose Your Plan">
      <div className="p-4 sm:p-6 space-y-8">
        {/* Description */}
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2">
            Simple, transparent pricing for everyone
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose the perfect plan for your business. All plans include core features with flexible pricing options.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {pricingTiers.map((tier) => (
            <PricingTierCard key={tier.name} tier={tier} />
          ))}
        </div>

        {/* FAQ Section */}
        <PricingFAQSection />
      </div>
    </Modal>
  );
}
