"use client";
// ==============================================================================
// shared/layouts/admin-header.tsx
// Top header bar for the admin layout with 3-language switcher (en | ar | ckb) & auth menu
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
  Check,
  KeyRound,
  Settings,
} from "lucide-react";
import { cn } from "@core/utils/cn";
import { useRTL } from "@core/hooks/use-rtl";
import {
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
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
import { useSignOut } from "@shared/hooks/auth/use-auth-hooks";
import { useAuthStore } from "@features/authentication/presentation/stores/auth.store";
import { ChangePasswordModal } from "@features/authentication/presentation/components/change-password-modal";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  className?: string;
}

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "ckb", label: "کوردی", flag: "☀️" },
];

export function AdminHeader({ onMenuToggle, className }: AdminHeaderProps) {
  const { user, openChangePasswordModal } = useAuthStore();
  const signOutMutation = useSignOut();
  const locale = useLocale();
  const router = useRouter();
  const isRtl = useRTL();
  const { theme, setTheme } = useTheme();

  const currentLanguage = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  const handleLocaleSwitch = (newLocale: string) => {
    if (newLocale === locale) return;
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/(en|ar|ckb|ku)/, "");
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const handleSignOut = async () => {
    await signOutMutation.mutateAsync();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const userInitials = user?.fullName
    ? user.initials
    : user?.email
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

        {/* 3-Locale Language Dropdown Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
              aria-label="Select Language"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium gap-1 flex items-center">
                <span>{currentLanguage.flag}</span>
                <span className="hidden sm:inline">{currentLanguage.label}</span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Select Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLocaleSwitch(lang.code)}
                className="flex items-center justify-between text-xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span className={lang.code === locale ? "font-bold" : ""}>{lang.label}</span>
                </div>
                {lang.code === locale && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.fullName ?? "Avatar"} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-xs font-medium text-muted-foreground max-w-[140px] truncate">
                {user?.fullName ?? user?.email ?? "Admin Portal"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRtl ? "start" : "end"} className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.fullName ?? "Administrator"}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {user?.email ?? "admin@ruknalassi.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/admin/profile`} className="cursor-pointer">
                  <User className="me-2 h-4 w-4" />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/admin/settings`} className="cursor-pointer">
                  <Settings className="me-2 h-4 w-4" />
                  Website Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openChangePasswordModal} className="cursor-pointer">
                <KeyRound className="me-2 h-4 w-4" />
                Change Password
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              disabled={signOutMutation.isPending}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="me-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ChangePasswordModal />
    </header>
  );
}
