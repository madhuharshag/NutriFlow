"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center text-center px-4">
          <div className="w-20 h-20 bg-status-error-bg rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-status-error" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Something went wrong</h1>
          <p className="text-text-muted max-w-md mb-8">
            An unexpected error occurred. Our team has been notified. We apologize for the inconvenience.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => reset()}
              className="btn-primary flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try again
            </button>
            <Link href="/home" className="btn-secondary flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
