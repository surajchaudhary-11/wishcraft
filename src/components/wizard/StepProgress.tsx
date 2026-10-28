import React from 'react';
import { Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  steps: { id: number; title: string; subtitle: string }[];
  onStepClick?: (step: number) => void;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  steps,
  onStepClick,
}) => {
  return (
    <div className="w-full py-4">
      {/* Desktop view */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Background connecting bar */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-plum-100 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-rosewood-500 -translate-y-1/2 transition-all duration-500 z-0"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <button
              key={step.id}
              disabled={step.id > currentStep}
              onClick={() => onStepClick && onStepClick(step.id)}
              className={`relative z-10 flex flex-col items-center group focus:outline-none ${
                step.id <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isCompleted
                    ? 'bg-rosewood-600 text-white shadow-soft'
                    : isCurrent
                    ? 'bg-plum-950 text-white ring-4 ring-rosewood-100 shadow-soft scale-110'
                    : 'bg-white border-2 border-plum-200 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
              </div>
              <span
                className={`mt-2 text-xs font-semibold tracking-tight transition-colors ${
                  isCurrent ? 'text-plum-950 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                {step.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile view */}
      <div className="sm:hidden flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-plum-100 shadow-soft">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rosewood-600">
            Step {currentStep} of {steps.length}
          </span>
          <h4 className="font-display font-bold text-sm text-plum-950">
            {steps[currentStep - 1]?.title}
          </h4>
        </div>
        <div className="flex gap-1.5">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                s.id === currentStep
                  ? 'w-6 bg-rosewood-600'
                  : s.id < currentStep
                  ? 'w-2 bg-rosewood-300'
                  : 'w-2 bg-plum-100'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
