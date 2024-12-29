import React, { useState } from 'react';
import { Bot, Lock } from 'lucide-react';
import { PricingModal } from '../../components/pricing/PricingModal';
import { cn } from '../../utils/cn';

export function AgentTemplates() {
  const [showPricing, setShowPricing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bot className="w-8 h-8 text-primary-500 dark:text-primary-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agent Templates</h1>
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
          Enable Agent Templates
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="max-w-3xl">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pre-built Agent Templates
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Save time and effort with our library of pre-built agent templates. Choose from a variety of industry-specific templates designed for common use cases.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Industry-Specific Templates
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Access templates tailored for different industries including customer service, sales, healthcare, and more.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Customizable Workflows
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Start with a template and customize it to match your specific needs and business requirements.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Best Practices Built-in
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Each template follows conversation design best practices and includes optimized prompts and workflows.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Regular Updates
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get access to new templates and updates as we continuously improve and expand our template library.
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
