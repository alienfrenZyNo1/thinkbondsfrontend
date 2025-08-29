"use client";

import { useState } from "react";

export default function SimpleTestPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Simple Test Page</h1>
      <p className="mb-4">This is a simple test page with a basic button.</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Click me: {count}
      </button>
    </div>
  );
}