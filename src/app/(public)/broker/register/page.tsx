'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PinVerificationForm } from '@/components/forms/PinVerificationForm';
import { BrokerRegistrationForm } from '@/components/forms/BrokerRegistrationForm';
import { SuccessMessage } from '@/components/ui/success-message';

function RegisterPageInner() {
  const [step, setStep] = useState<'pin' | 'registration' | 'success'>('pin');
  const searchParams = useSearchParams();
  const _email = searchParams?.get('email') ?? '';

  const handlePinSuccess = () => {
    setStep('registration');
  };

  const handleRegistrationSuccess = () => {
    setStep('success');
  };

  if (step === 'success') {
    return (
      <SuccessMessage
        title="Registration Complete"
        message="Your registration has been submitted successfully. A wholesaler will review your application."
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Broker Registration
      </h1>

      {step === 'pin' && (
        <PinVerificationForm onSuccess={handlePinSuccess} email={_email} />
      )}

      {step === 'registration' && (
        <BrokerRegistrationForm
          onSuccess={handleRegistrationSuccess}
          email={_email}
        />
      )}
    </div>
  );
}

export default function BrokerRegisterPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      <RegisterPageInner />
    </Suspense>
  );
}
