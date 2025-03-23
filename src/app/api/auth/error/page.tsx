'use client';

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from 'react';

// Component that uses useSearchParams
function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Something went wrong. Please try again.";
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 md:p-8 text-center max-w-md">
        <h1 className="text-2xl font-bold text-red-700 dark:text-red-500">
          Authentication Error
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mt-3" aria-live="polite">
          {decodeURIComponent(error)}
        </p>
        
        <div className="mt-6 space-y-4">
          <Link
            href="/auth/sign-in"
            className="inline-block w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="inline-block w-full text-gray-700 dark:text-gray-300 hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 md:p-8 text-center max-w-md">
          <p className="text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}