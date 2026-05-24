"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <html>
      <body className="font-sans antialiased bg-background text-foreground">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Something went wrong!
            </h1>
            
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              We encountered an unexpected error while loading this page. Our team has been notified.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => reset()}
                className="w-full bg-maroon-700 hover:bg-maroon-800 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Try again
              </button>
              
              <Link
                href="/"
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-3 rounded-lg transition-colors"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
