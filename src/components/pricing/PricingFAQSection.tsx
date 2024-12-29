import React from 'react';

export function PricingFAQSection() {
  return (
    <div className="pt-6 border-t dark:border-gray-700">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
        Frequently Asked Questions
      </h4>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            What are credits?
          </h5>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Credits are used for voice calls and other platform features. Each minute of standard audio costs 5 credits, while premium audio costs 7 credits.
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Can I upgrade anytime?
          </h5>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Yes, you can upgrade your plan at any time. Your new features and credits will be available immediately after upgrading.
          </p>
        </div>
      </div>
    </div>
  );
}
