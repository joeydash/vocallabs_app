import React, { useState } from 'react';
import { FileJson, Lock } from 'lucide-react';
import { PricingModal } from '../../components/pricing/PricingModal';
import { cn } from '../../utils/cn';

export function CallData() {
  const [showPricing, setShowPricing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileJson className="w-8 h-8 text-primary-500 dark:text-primary-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Call Data</h1>
        </div>
        <button
          onClick={() => setShowPricing(true)}
          className={cn(
            "inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg",
            "text-white bg-primary-600",
            "hover:bg-primary-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
            "transition-colors duration-200"
          )}
        >
          <Lock className="w-4 h-4 mr-2" />
          Enable Call Data Storage
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="max-w-3xl">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Analyze Your Call Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Call data analysis helps you understand customer interactions better. Track key metrics, identify patterns, and make data-driven decisions to improve your customer engagement.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Data Collection
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically collect and store important data points from every call, including customer sentiment, key topics discussed, and action items.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Analytics & Insights
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generate detailed reports and insights to understand customer needs, improve agent performance, and optimize your communication strategy.
              </p>
            </div>
          </div>
        </div>
      </div>

      <PricingModal 
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
      />
    </div>
  );
}
