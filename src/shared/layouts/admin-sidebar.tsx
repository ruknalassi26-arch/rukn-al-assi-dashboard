"use client";
// ==============================================================================
// shared/layouts/admin-sidebar.tsx
// Collapsible admin sidebar with navigation links & top collapse arrow button
// ==============================================================================
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Package,
  Wrench,
  FolderKanban,
  FileText,
  Mail,
  Settings,
  Search,
  Home,
  Info,
  ChevronLeft,
  ChevronRight,
  Shield,
  Users,
  Building2,
  User,
  Activity,
  Bell,
  Briefcase,
  FileCheck,
  FileQuestion,
  Layers,
  UserCheck,
  Calendar,
  CalendarCheck,
} from "lucide-react";
import { cn } from "@core/utils/cn";
import { useRTL } from "@core/hooks/use-rtl";
import { Button } from "@shared/ui";
import { ScrollArea } from "@shared/ui";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shared/ui";

import { usePermission } from "@features/roles-permissions/presentation/hooks/use-permission";
import type { ResourceCode } from "@features/roles-permissions/domain/entities/role.enums";

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ElementType;
  resource?: ResourceCode;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", labelKey: "dashboard", icon: LayoutDashboard, resource: "dashboard" },
  { href: "/admin/leave", labelKey: "myLeave", icon: Calendar },
  { href: "/admin/leave-management", labelKey: "leaveManagement", icon: CalendarCheck, resource: "leave" },
  { href: "/admin/about", labelKey: "about", icon: Info, resource: "about" },
  { href: "/admin/products", labelKey: "products", icon: Package, resource: "products" },
  { href: "/admin/categories", labelKey: "categories", icon: Layers, resource: "products" },
  { href: "/admin/services", labelKey: "services", icon: Wrench, resource: "services" },
  { href: "/admin/certificates", labelKey: "certificates", icon: Shield, resource: "about" },
  { href: "/admin/team", labelKey: "team", icon: Users, resource: "about" },
  { href: "/admin/projects", labelKey: "projects", icon: FolderKanban, resource: "projects" },
  { href: "/admin/careers/postings", labelKey: "jobPostings", icon: Briefcase, resource: "careers" },
  { href: "/admin/careers/applications", labelKey: "careerApplications", icon: FileCheck, resource: "careers" },
  { href: "/admin/rfq", labelKey: "rfq", icon: FileQuestion, resource: "rfq" },
  { href: "/admin/branches", labelKey: "branches", icon: Building2, resource: "branches" },
  { href: "/admin/contact-messages", labelKey: "contactMessages", icon: Mail, resource: "messages" },
  { href: "/admin/homepage", labelKey: "homepage", icon: Home, resource: "homepage" },
  { href: "/admin/seo", labelKey: "seo", icon: Search, resource: "seo" },
  { href: "/admin/users", labelKey: "users", icon: UserCheck, resource: "users" },
  { href: "/admin/roles", labelKey: "roles", icon: Shield, resource: "roles" },
  { href: "/admin/profile", labelKey: "profile", icon: User },
  { href: "/admin/activity-log", labelKey: "activityLog", icon: Activity, resource: "activity_log" },
  { href: "/admin/notifications", labelKey: "notifications", icon: Bell, resource: "notifications" },
  { href: "/admin/settings", labelKey: "settings", icon: Settings, resource: "settings" },
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("sidebar");
  const isRtl = useRTL();
  const { hasPermission } = usePermission();

  const filteredNavItems = NAV_ITEMS.filter(
    (item) => !item.resource || hasPermission(item.resource, "view")
  );

  const isActive = (href: string) => {
    const localizedHref = `/${locale}${href}`;
    if (href === "/admin") {
      return pathname === localizedHref || pathname === `${localizedHref}/`;
    }
    return pathname.startsWith(localizedHref);
  };

  const CollapseIcon = isRtl
    ? collapsed ? ChevronLeft : ChevronRight
    : collapsed ? ChevronRight : ChevronLeft;

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        dir={isRtl ? "rtl" : "ltr"}
        className={cn(
          "relative flex h-screen flex-col border-e bg-card transition-all duration-300",
          collapsed ? "w-[68px]" : "w-[270px]",
          className
        )}
      >
        {/* Floating Collapse/Expand Button beside sidebar */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "absolute top-5 z-40 flex h-6 w-6 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-md transition-all hover:bg-accent hover:text-foreground hover:scale-110 active:scale-95",
            isRtl ? "-left-3" : "-right-3"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <CollapseIcon className="h-3.5 w-3.5" />
        </button>

        {/* Top Logo Header */}
        <div
          className={cn(
            "flex h-16 items-center border-b px-4 transition-all",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <Link
            href={`/${locale}/admin`}
            className="flex items-center gap-3 overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="Rukn Al Assi Logo"
              className="h-9 w-9 shrink-0 rounded-md object-contain border bg-white p-0.5 shadow-sm"
            />
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-bold text-foreground">
                  Rukn Al Assi
                </span>
                <span className="truncate text-[10px] font-medium text-muted-foreground">
                  Admin Portal
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation items */}
        <ScrollArea className="flex-1 px-3.5 py-4">
          <nav className="flex flex-col gap-1" role="navigation" aria-label="Admin navigation">
            {filteredNavItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              const label = t(item.labelKey);

              const linkContent = (
                <Link
                  href={`/${locale}${item.href}`}
                  dir={isRtl ? "rtl" : "ltr"}
                  className={cn(
                    "group flex items-center gap-3.5 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200 text-start",
                    active
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    collapsed && "justify-center px-2"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      active
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-accent-foreground"
                    )}
                  />
                  {!collapsed && (
                    <span className="truncate flex-1 text-start">{label}</span>
                  )}
                  {!collapsed && item.badge !== undefined && item.badge > 0 && (
                    <span className="ms-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side={isRtl ? "left" : "right"} sideOffset={8}>
                      {label}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={item.href}>{linkContent}</div>;
            })}
          </nav>
        </ScrollArea>
      </aside>
    </TooltipProvider>
  );
}
