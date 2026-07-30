"use client";
// ==============================================================================
// shared/layouts/admin-header.tsx
// Top header bar for the admin layout
// ==============================================================================
import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LogOut,
  User,
  Globe,
  Menu,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@core/utils/cn";
import { useAuth } from "@core/providers";
import { useRTL } from "@core/hooks/use-rtl";
import {
  Button,
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
} from "@shared/ui";
import { AdminBreadcrumb } from "./admin-breadcrumb";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  className?: string;
}

export function AdminHeader({ onMenuToggle, className }: AdminHeaderProps) {
  const { user, signOut } = useAuth();
  const locale = useLocale();
  const router = useRouter();
  const isRtl = useRTL();
  const { theme, setTheme } = useTheme();

  const otherLocale = locale === "en" ? "ar" : "en";
  const otherLocaleLabel = locale === "en" ? "العربية" : "English";

  const handleLocaleSwitch = () => {
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/(en|ar)/, "");
    router.push(`/${otherLocale}${pathWithoutLocale}`);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push(`/${locale}/admin/login`);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "AD";

  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between border-b bg-card px-4 md:px-6",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <AdminBreadcrumb />
      </div>

      <div className="flex items-center gap-2">
        {/* Theme mode toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Toggle dark/light theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Locale toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLocaleSwitch}
          className="gap-2 text-muted-foreground hover:text-foreground"
          aria-label={`Switch to ${otherLocaleLabel}`}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline text-xs font-medium">{otherLocaleLabel}</span>
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-xs font-medium text-muted-foreground max-w-[140px] truncate">
                {user?.email ?? "Admin"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRtl ? "start" : "end"} className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Administrator</p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {user?.email ?? "admin@ruknalassi.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/admin/settings`} className="cursor-pointer">
                  <User className="me-2 h-4 w-4" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="me-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
