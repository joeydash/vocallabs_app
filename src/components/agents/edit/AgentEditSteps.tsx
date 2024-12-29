import React from 'react';
import { cn } from '../../../utils/cn';

interface Step {
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

interface AgentEditStepsProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

export function AgentEditSteps({ steps, currentStep, onStepChange }: AgentEditStepsProps) {
  return (
    <nav aria-label="Progress" className="px-4 sm:px-6 py-4">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isCurrent = index === currentStep;

          return (
            <div 
              key={step.title} 
              className={cn(
                "flex flex-col items-center transition-all duration-300",
                "group cursor-pointer"
              )}
              onClick={() => onStepChange(index)}
            >
              <div 
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-300",
                  "shadow-sm transform",
                  isActive
                    ? "bg-primary-500 dark:bg-primary-400 text-white scale-100"
                    : "bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 scale-95 group-hover:scale-100",
                  isCurrent && "ring-4 ring-primary-100 dark:ring-primary-900",
                  !isActive && "group-hover:bg-gray-50 dark:group-hover:bg-gray-700"
                )}
              >
                {index + 1}
              </div>
              <div className="mt-3 text-center">
                <div 
                  className={cn(
                    "text-sm font-medium mb-1 transition-colors duration-300",
                    isActive 
                      ? "text-primary-600 dark:text-primary-400" 
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {step.title}
                </div>
                <div 
                  className={cn(
                    "text-xs transition-colors duration-300",
                    isActive 
                      ? "text-gray-600 dark:text-gray-300" 
                      : "text-gray-400 dark:text-gray-500"
                  )}
                >
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
