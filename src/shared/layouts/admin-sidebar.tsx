"use client";
// ==============================================================================
// shared/layouts/admin-sidebar.tsx
// Collapsible admin sidebar with navigation links
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
  Phone,
  Building2,
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

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ElementType;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/admin/about", labelKey: "about", icon: Info },
  { href: "/admin/products", labelKey: "products", icon: Package },
  { href: "/admin/categories", labelKey: "categories", icon: FolderKanban },
  { href: "/admin/services", labelKey: "services", icon: Wrench },
  { href: "/admin/certificates", labelKey: "certificates", icon: Shield },
  { href: "/admin/team", labelKey: "team", icon: Users },
  { href: "/admin/projects", labelKey: "projects", icon: FolderKanban },
  { href: "/admin/rfq", labelKey: "rfq", icon: FileText },
  { href: "/admin/branches", labelKey: "branches", icon: Building2 },
  { href: "/admin/contact-messages", labelKey: "contactMessages", icon: Mail },
  { href: "/admin/homepage", labelKey: "homepage", icon: Home },
  { href: "/admin/seo", labelKey: "seo", icon: Search },
  { href: "/admin/settings", labelKey: "settings", icon: Settings },
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
        className={cn(
          "relative flex h-screen flex-col border-e bg-card transition-all duration-300",
          collapsed ? "w-[68px]" : "w-[260px]",
          className
        )}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center border-b px-4">
          <Link
            href={`/${locale}/admin`}
            className="flex items-center gap-3 overflow-hidden"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-5 w-5" />
            </div>
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

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-1" role="navigation" aria-label="Admin navigation">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              const label = t(item.labelKey);

              const linkContent = (
                <Link
                  href={`/${locale}${item.href}`}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
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
                    <span className="truncate">{label}</span>
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

        {/* Collapse toggle */}
        <div className="border-t p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full justify-center"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <CollapseIcon className="h-4 w-4" />
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
