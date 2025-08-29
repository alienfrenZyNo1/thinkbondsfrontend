"use client";

import { Button } from "@/components/ui/button";

export function HomeButtons() {
  const handleSignIn = () => {
    window.location.href = "/api/auth/signin";
  };

  const handleRequestAccess = () => {
    window.location.href = "/access/request";
  };

  const handleRegisterAsBroker = () => {
    window.location.href = "/broker/register";
  };

  return (
    <div className="flex flex-col space-y-4">
      <Button onClick={handleSignIn}>
        Sign In
      </Button>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or
          </span>
        </div>
      </div>
      <Button variant="outline" onClick={handleRequestAccess}>
        Request Access
      </Button>
      <Button variant="outline" onClick={handleRegisterAsBroker}>
        Register as Broker
      </Button>
    </div>
  );
}