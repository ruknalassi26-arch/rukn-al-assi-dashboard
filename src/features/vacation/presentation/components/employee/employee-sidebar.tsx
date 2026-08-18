"use client";
// ==============================================================================
// features/vacation/presentation/components/employee/employee-sidebar.tsx
// Dedicated Sidebar for the Employee Self-Service Portal
// ==============================================================================
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import {
  LayoutDashboard,
  CalendarPlus,
  History,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@core/utils/cn";
import { useRTL } from "@core/hooks/use-rtl";
import {
  ScrollArea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Button,
} from "@shared/ui";
import { useSignOut } from "@shared/hooks/auth/use-auth-hooks";

const EMPLOYEE_NAV_ITEMS = [
  {
    href: "/employee/vacation",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/employee/vacation/apply",
    label: "Apply Vacation",
    icon: CalendarPlus,
  },
  {
    href: "/employee/vacation/history",
    label: "Vacation History",
    icon: History,
  },
  {
    href: "/employee/profile",
    label: "My Profile",
    icon: User,
  },
];

interface EmployeeSidebarProps {
  className?: string;
}

export function EmployeeSidebar({ className }: EmployeeSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const isRtl = useRTL();
  const signOutMutation = useSignOut();

  const isActive = (href: string) => {
    const localizedHref = `/${locale}${href}`;
    if (href === "/employee/vacation") {
      return pathname === localizedHref || pathname === `${localizedHref}/`;
    }
    return pathname.startsWith(localizedHref);
  };

  const CollapseIcon = isRtl
    ? collapsed
      ? ChevronLeft
      : ChevronRight
    : collapsed
      ? ChevronRight
      : ChevronLeft;

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        dir={isRtl ? "rtl" : "ltr"}
        className={cn(
          "relative flex h-screen flex-col border-e bg-card transition-all duration-300 select-none",
          collapsed ? "w-[68px]" : "w-[260px]",
          className
        )}
      >
        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "absolute top-5 z-40 flex h-6 w-6 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-md transition-all hover:bg-accent hover:text-foreground",
            isRtl ? "-left-3" : "-right-3"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <CollapseIcon className="h-3.5 w-3.5" />
        </button>

        {/* Top Logo */}
        <div
          className={cn(
            "flex h-16 items-center border-b px-4 transition-all",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <Link
            href={`/${locale}/employee/vacation`}
            className="flex items-center gap-3 overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="Logo"
              className="h-8 w-8 shrink-0 rounded-md object-contain border bg-white p-0.5"
            />
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-xs font-bold text-foreground">
                  Rukn Al Assi
                </span>
                <span className="truncate text-[10px] font-medium text-primary">
                  Employee Portal
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Nav Links */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-1.5">
            {EMPLOYEE_NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              const linkContent = (
                <Link
                  href={`/${locale}${item.href}`}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary shadow-xs font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side={isRtl ? "left" : "right"} className="text-xs">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={item.href}>{linkContent}</div>;
            })}
          </nav>
        </ScrollArea>

        {/* Footer Logout */}
        <div className="p-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOutMutation.mutate()}
            className={cn(
              "w-full text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 justify-start gap-2.5",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
