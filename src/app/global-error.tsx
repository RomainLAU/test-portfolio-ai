"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body className={`
        flex flex-col items-center justify-center min-h-screen bg-black
        text-white p-4
      `}>
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-400 mb-8 max-w-md text-center">
          A critical error occurred. Please try refreshing the page or contact
          support if the issue persists.
        </p>
        <button
          onClick={() => reset()}
          className={`
            px-6 py-2 bg-white text-black font-medium rounded-full
            hover:bg-opacity-90
            transition-all
            active:scale-95
          `}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
