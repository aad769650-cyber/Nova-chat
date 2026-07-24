"use client";

import { Toaster } from "sonner";

/**
 * AppProviders centralizes every client-side provider the app needs
 * (toasts, future query/client providers, context providers, etc.)
 * so app/layout.jsx stays a clean server component.
 */
export function AppProviders({ children }) {
  return (
    <>
      {children}
      <Toaster
        theme="dark"
        position="bottom-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast:
              "!bg-card !border !border-white/10 !text-foreground !shadow-glow",
            description: "!text-muted-foreground",
          },
        }}
      />
    </>
  );
}
