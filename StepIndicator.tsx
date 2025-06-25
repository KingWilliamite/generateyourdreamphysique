import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  icon: LucideIcon;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-center">
      <div className="flex items-center space-x-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-white shadow-lg'
                      : isCompleted
                      ? 'text-white'
                      : 'text-gray-400 bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: isActive ? '#007AFF' : isCompleted ? '#34C759' : undefined
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p
                    className={`text-sm font-semibold ${
                      isActive ? 'text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 transition-all duration-200 ${
                    isCompleted ? 'bg-green-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;