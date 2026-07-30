// ==============================================================================
// src/app/[locale]/(public)/layout.tsx
// Public-facing layout — wraps all public pages
// ==============================================================================
import type { ReactNode } from "react";
import { NetworkErrorBanner } from "@shared/components/network-error-ui";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <Navbar /> */}
      <main className="flex-1">{children}</main>
      {/* <Footer /> */}
      <NetworkErrorBanner />
    </div>
  );
}
