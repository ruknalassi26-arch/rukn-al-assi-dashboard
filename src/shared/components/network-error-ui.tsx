"use client";
// ==============================================================================
// shared/components/network-error-ui.tsx
// Offline warning banner displayed automatically when network drops
// ==============================================================================
import { WifiOff } from "lucide-react";
import { useOffline } from "@core/hooks/use-offline";
import { cn } from "@core/utils/cn";

export function NetworkErrorBanner() {
  const { isOffline } = useOffline();

  if (!isOffline) return null;

  return (
    <div
      role="alert"
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg bg-destructive px-4 py-3 text-destructive-foreground shadow-lg animate-slide-in-bottom"
      )}
    >
      <WifiOff className="h-5 w-5 animate-pulse" />
      <div>
        <p className="text-sm font-semibold">You are currently offline</p>
        <p className="text-xs opacity-90">Please check your internet connection.</p>
      </div>
    </div>
  );
}
