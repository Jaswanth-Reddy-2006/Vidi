"use client";

import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "var(--font-body)",
          },
        }}
        richColors
        closeButton
      />
    </ThemeProvider>
  );
}
