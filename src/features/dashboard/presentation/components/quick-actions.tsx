"use client";
// ==============================================================================
// features/dashboard/presentation/components/quick-actions.tsx
// Quick Actions Bar with Shortcuts to Common Admin Tasks
// ==============================================================================
import Link from "next/link";
import { useLocale } from "next-intl";
import { Plus, Package, Wrench, FolderKanban, ShieldCheck, Users, FileText } from "lucide-react";
import { Button } from "@shared/ui";

export function QuickActions() {
  const locale = useLocale();

  const actions = [
    {
      label: "Add Product",
      href: `/${locale}/admin/products/create`,
      icon: Package,
      variant: "default" as const,
    },
    {
      label: "Add Service",
      href: `/${locale}/admin/services/create`,
      icon: Wrench,
      variant: "outline" as const,
    },
    {
      label: "Add Category",
      href: `/${locale}/admin/categories/create`,
      icon: FolderKanban,
      variant: "outline" as const,
    },
    {
      label: "Add Certificate",
      href: `/${locale}/admin/certificates/create`,
      icon: ShieldCheck,
      variant: "outline" as const,
    },
    {
      label: "Add Team Member",
      href: `/${locale}/admin/team/create`,
      icon: Users,
      variant: "outline" as const,
    },
    {
      label: "View RFQs",
      href: `/${locale}/admin/rfq`,
      icon: FileText,
      variant: "secondary" as const,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl border bg-card/60 backdrop-blur-xs shadow-2xs">
      <span className="text-xs font-semibold text-muted-foreground me-1 px-1 hidden sm:inline">
        Quick Actions:
      </span>
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Button
            key={index}
            variant={action.variant}
            size="sm"
            asChild
            className="gap-1.5 text-xs h-8"
          >
            <Link href={action.href}>
              <Plus className="h-3.5 w-3.5" />
              <span>{action.label}</span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
