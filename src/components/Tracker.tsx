import React from 'react';

interface TrackerStep {
  key: string;
  label: string;
  badge?: { text: string; className?: string };
}

interface TrackerProps {
  steps: TrackerStep[];
  onStepClick: (key: string) => void;
}

export default function Tracker({ steps, onStepClick }: TrackerProps) {
  return (
    <div className="flex overflow-x-auto space-x-4 py-4 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {steps.map((step, i) => (
        <div
          key={step.key}
          className="text-center flex-1 cursor-pointer"
          onClick={() => onStepClick(step.key)}
        >
          <div className="w-8 h-8 mx-auto rounded-full btn-primary text-white flex items-center justify-center text-sm font-semibold">
            {i + 1}
          </div>
          <p className="text-xs mt-1 text-gray-600">{step.label}</p>
          {step.badge && (
            <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] rounded-full ${step.badge.className || 'bg-gray-200 text-gray-700'}`}>
              {step.badge.text}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
