"use client";
// ==============================================================================
// features/dashboard/presentation/views/components/quick-actions.tsx
// Quick action cards for common admin tasks
// ==============================================================================
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Plus,
  Package,
  Wrench,
  FolderKanban,
  FileText,
  Settings,
  Search,
  Home,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@core/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui";

interface QuickAction {
  labelKey: string;
  href: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    labelKey: "addProduct",
    href: "/admin/products/new",
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-500/10 hover:bg-blue-500/20",
  },
  {
    labelKey: "addService",
    href: "/admin/services/new",
    icon: Wrench,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10 hover:bg-emerald-500/20",
  },
  {
    labelKey: "addProject",
    href: "/admin/projects/new",
    icon: FolderKanban,
    color: "text-violet-600",
    bg: "bg-violet-500/10 hover:bg-violet-500/20",
  },
  {
    labelKey: "viewRfqs",
    href: "/admin/rfq",
    icon: FileText,
    color: "text-amber-600",
    bg: "bg-amber-500/10 hover:bg-amber-500/20",
  },
  {
    labelKey: "websiteSettings",
    href: "/admin/settings",
    icon: Settings,
    color: "text-gray-600",
    bg: "bg-gray-500/10 hover:bg-gray-500/20",
  },
  {
    labelKey: "seoSettings",
    href: "/admin/seo",
    icon: Search,
    color: "text-cyan-600",
    bg: "bg-cyan-500/10 hover:bg-cyan-500/20",
  },
  {
    labelKey: "homepage",
    href: "/admin/homepage",
    icon: Home,
    color: "text-rose-600",
    bg: "bg-rose-500/10 hover:bg-rose-500/20",
  },
];

export function QuickActions() {
  const locale = useLocale();
  const t = useTranslations("dashboard.quickActions");

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Plus className="h-5 w-5 text-primary" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.labelKey}
                href={`/${locale}${action.href}`}
                className={cn(
                  "flex flex-col items-center gap-2.5 rounded-xl p-4 transition-all duration-200",
                  action.bg
                )}
              >
                <div className={cn("rounded-lg p-2.5", action.bg)}>
                  <Icon className={cn("h-5 w-5", action.color)} />
                </div>
                <span className="text-xs font-medium text-center text-foreground leading-tight">
                  {t(action.labelKey)}
                </span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
