"use client";
// ==============================================================================
// app/[locale]/(admin)/admin/homepage/hero/[id]/edit/page.tsx
// Deprecated Slide Route: Redirects to Homepage Manager
// ==============================================================================
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EditHeroSlidePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/homepage");
  }, [router]);

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}
