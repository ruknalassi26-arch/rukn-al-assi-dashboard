"use client";
// ==============================================================================
// core/providers/index.tsx
// Root provider that composes all providers in one place
// ==============================================================================
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./auth-provider";
import { QueryProvider } from "./query-provider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

export { useAuth } from "./auth-provider";
export { QueryProvider } from "./query-provider";
export { AuthProvider } from "./auth-provider";
