"use client";
// ==============================================================================
// features/dashboard/presentation/components/quick-actions.tsx
// Quick shortcuts bar for Dashboard
// ==============================================================================
import Link from "next/link";
import { Plus, Package, Wrench, FolderKanban, Home, Info } from "lucide-react";
import { Button } from "@shared/ui";

export function QuickActions() {
  return (
    <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border bg-card shadow-sm">
      <span className="text-xs font-semibold text-muted-foreground me-2">Quick Shortcuts:</span>
      <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
        <Link href="/admin/homepage">
          <Home className="h-3.5 w-3.5 text-blue-600" /> Homepage Editor
        </Link>
      </Button>
      <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
        <Link href="/admin/about">
          <Info className="h-3.5 w-3.5 text-emerald-600" /> About Us Settings
        </Link>
      </Button>
      <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
        <Link href="/admin/products">
          <Package className="h-3.5 w-3.5 text-violet-600" /> Manage Products
        </Link>
      </Button>
      <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
        <Link href="/admin/services">
          <Wrench className="h-3.5 w-3.5 text-amber-600" /> Manage Services
        </Link>
      </Button>
      <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
        <Link href="/admin/projects">
          <FolderKanban className="h-3.5 w-3.5 text-rose-600" /> Projects Portfolio
        </Link>
      </Button>
    </div>
  );
}
