'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center">
      <h2 className="text-xl font-semibold mb-4 text-white">Application Error</h2>
      <p className="text-gray-400 mb-6">Something went wrong while rendering this page.</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
