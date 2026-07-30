"use client";
// ==============================================================================
// shared/layouts/admin-breadcrumb.tsx
// Dynamic breadcrumb component based on pathname
// ==============================================================================
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@core/utils/cn";
import { useRTL } from "@core/hooks/use-rtl";

/**
 * Maps URL segments to translation keys and display labels.
 */
const SEGMENT_MAP: Record<string, string> = {
  admin: "dashboard",
  products: "products",
  services: "services",
  projects: "projects",
  rfq: "rfq",
  contacts: "contacts",
  homepage: "homepage",
  seo: "seo",
  settings: "settings",
  login: "login",
};

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("sidebar");
  const isRtl = useRTL();

  // Remove locale prefix and split into segments
  const segments = pathname
    .replace(new RegExp(`^/${locale}`), "")
    .split("/")
    .filter(Boolean);

  // Build breadcrumb items
  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${locale}/${segments.slice(0, index + 1).join("/")}`;
    const labelKey = SEGMENT_MAP[segment];
    let label: string;
    try {
      label = labelKey ? t(labelKey) : segment.charAt(0).toUpperCase() + segment.slice(1);
    } catch {
      label = segment.charAt(0).toUpperCase() + segment.slice(1);
    }
    const isLast = index === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link
        href={`/${locale}/admin`}
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.map((crumb) => (
        <div key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground/50",
              isRtl && "rotate-180"
            )}
          />
          {crumb.isLast ? (
            <span className="font-medium text-foreground" aria-current="page">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
