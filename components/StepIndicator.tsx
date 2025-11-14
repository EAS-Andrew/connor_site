import React from 'react';

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto mb-8 sm:mb-12 px-2">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center">
            <div
              className={`
                w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-heading text-base sm:text-lg transition-all duration-300
                ${currentStep === step.number
                  ? 'bg-infrared text-ghost-white ring-2 sm:ring-4 ring-infrared/30'
                  : currentStep > step.number
                    ? 'bg-radar-grey text-ghost-white border-2 border-infrared'
                    : 'bg-stealth-black text-radar-grey-light border-2 border-radar-grey'
                }
              `}
            >
              {step.number}
            </div>
            <span
              className={`
                mt-2 text-xs sm:text-sm font-sans text-center max-w-[60px] sm:max-w-none
                ${currentStep === step.number
                  ? 'text-ghost-white font-semibold'
                  : 'text-radar-grey-light'
                }
              `}
            >
              {step.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div className="flex-1 h-[2px] mx-2 sm:mx-4 mb-6 sm:mb-8">
              <div
                className={`
                  h-full transition-all duration-300
                  ${currentStep > step.number
                    ? 'bg-infrared'
                    : 'bg-radar-grey'
                  }
                `}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

