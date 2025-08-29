'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Step {
  id: string;
  title: string;
  component: React.ReactNode;
}

interface FormWizardProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  steps: Step[];
  onSubmit: (data: T) => void | Promise<void>;
  initialData?: T;
}

export default function FormWizard<
  T extends Record<string, unknown> = Record<string, unknown>,
>({ steps, onSubmit, initialData = {} as T }: FormWizardProps<T>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<T>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = (stepData: Partial<T>) => {
    setFormData({ ...formData, ...stepData } as T);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit({ ...formData, ...stepData } as T);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: T) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    // Save draft logic would go here
    console.log('Saving draft:', formData);
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0"></div>
          <div
            className="absolute top-4 left-0 h-1 bg-blue-500 z-10 transition-all duration-300"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 10}%`,
            }}
          ></div>

          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative z-20 flex flex-col items-center"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
              <span className="mt-2 text-sm font-medium hidden md:block">
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Current step content */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {steps[currentStep]?.component}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <div>
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button
            onClick={() => {
              // In a real implementation, we would collect data from the current step component
              // For now, we'll just move to the next step
              handleNext({});
            }}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Submitting...'
              : currentStep === steps.length - 1
                ? 'Submit'
                : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
