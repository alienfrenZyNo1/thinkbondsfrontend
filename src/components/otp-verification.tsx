"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OtpVerificationProps {
  onVerify: (otp: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function OtpVerification({ onVerify, isLoading, error }: OtpVerificationProps) {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(otp);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Verify Your Identity</h2>
      <p className="mb-4">Please enter the 6-digit code sent to your email to continue.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="mt-1"
          />
        </div>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <Button 
          type="submit" 
          disabled={isLoading || otp.length !== 6}
          className="w-full"
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>
      </form>
      
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-3 bg-yellow-100 rounded">
          <p className="text-sm">
            <strong>Development Mode:</strong> Use code <code className="bg-gray-200 px-1 rounded">123456</code> to proceed.
          </p>
        </div>
      )}
    </div>
  );
}