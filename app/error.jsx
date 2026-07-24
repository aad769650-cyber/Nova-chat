"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Replace with a real error-reporting service (Sentry, etc.) later.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="glass-panel flex max-w-md flex-col items-center gap-4 px-10 py-12 text-center animate-fade-in">
        <span className="text-4xl">⚠</span>
        <h1 className="text-xl font-semibold text-foreground">
          Something broke on our end
        </h1>
        <p className="text-sm text-muted-foreground">
          The last action didn't go through. Try again, and if it keeps happening, refresh the page.
        </p>
        {error?.digest && (
          <p className="font-data text-xs text-muted-foreground/70">
            Reference: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="mt-2 inline-flex items-center justify-center rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
