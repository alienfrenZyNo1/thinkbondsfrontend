"use client";

import { useState } from "react";
import { AccessRequestForm } from "@/components/forms/AccessRequestForm";

interface AccessRequestWrapperProps {
  onSuccess?: (data: { email: string; pin6: string; link: string }) => void;
}

export function AccessRequestWrapper({ onSuccess }: AccessRequestWrapperProps) {
  const [successData, setSuccessData] = useState<{ email: string; pin6: string; link: string } | null>(null);

  const handleSuccess = (data: { email: string; pin6: string; link: string }) => {
    setSuccessData(data);
    if (onSuccess) {
      onSuccess(data);
    }
  };

  if (successData) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Access Request Successful</h1>
        <div className="space-y-4">
          <p className="text-gray-700">
            Your access request has been successfully submitted. Please check your email for further instructions.
          </p>
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-sm text-green-800">
              <strong>Email:</strong> {successData.email}
            </p>
            <p className="text-sm text-green-800">
              <strong>Access Code:</strong> {successData.pin6}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Request Access</h1>
      <AccessRequestForm onSuccess={handleSuccess} />
    </div>
  );
}