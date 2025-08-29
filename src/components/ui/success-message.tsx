import { CheckCircle } from "lucide-react";

interface SuccessMessageProps {
  title: string;
  message: string;
  children?: React.ReactNode;
}

export function SuccessMessage({ title, message, children }: SuccessMessageProps) {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">
        <CheckCircle className="h-12 w-12 text-green-500" />
      </div>
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="mb-4">{message}</p>
      {children}
    </div>
  );
}