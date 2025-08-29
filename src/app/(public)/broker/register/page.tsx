"use client";

import { useState } from "react";
import { PinVerificationForm } from "@/components/forms/PinVerificationForm";
import { BrokerRegistrationForm } from "@/components/forms/BrokerRegistrationForm";
import { SuccessMessage } from "@/components/ui/success-message";

export default function BrokerRegisterPage() {
  const [step, setStep] = useState<"pin" | "registration" | "success">("pin");
  const [email, setEmail] = useState("");

  const handlePinSuccess = () => {
    setStep("registration");
  };

  const handleRegistrationSuccess = () => {
    setStep("success");
  };

  if (step === "success") {
    return (
      <SuccessMessage
        title="Registration Complete"
        message="Your registration has been submitted successfully. A wholesaler will review your application."
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Broker Registration</h1>
      
      {step === "pin" && (
        <PinVerificationForm
          onSuccess={handlePinSuccess}
          email={email}
        />
      )}
      
      {step === "registration" && (
        <BrokerRegistrationForm
          onSuccess={handleRegistrationSuccess}
          email={email}
        />
      )}
    </div>
  );
}