"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Failed to load content
        </h2>
        
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          We're having trouble displaying this section. Please try again.
        </p>

        <button
          onClick={() => reset()}
          className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white font-medium px-8 py-3 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
