"use client";
// ==============================================================================
// core/hooks/use-offline.ts
// Offline connectivity status detection hook
// ==============================================================================
import { useEffect, useState } from "react";

export function useOffline(): { isOffline: boolean; isOnline: boolean } {
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect(() => {
    // Check initial state
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    isOffline,
    isOnline: !isOffline,
  };
}
