"use client";
// ==============================================================================
// shared/layouts/admin-shell.tsx
// Complete admin shell with sidebar, header, and content area
// ==============================================================================
import { useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@core/utils/cn";
import { useAuth } from "@core/providers";
import { useRTL } from "@core/hooks/use-rtl";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { NetworkErrorBanner } from "@shared/components";
import { PageLoader } from "@shared/components";

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoading, isAuthenticated } = useAuth();
  const isRtl = useRTL();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className={cn(
              "fixed inset-y-0 z-50 md:hidden",
              isRtl ? "right-0" : "left-0"
            )}
          >
            <AdminSidebar />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Network error banner */}
      <NetworkErrorBanner />
    </div>
  );
}
