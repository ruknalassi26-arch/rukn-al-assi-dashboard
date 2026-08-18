"use client";
// ==============================================================================
// features/vacation/presentation/components/employee/employee-header.tsx
// Header Bar for Employee Portal with Notifications, Language, Theme & Profile
// ==============================================================================
import Link from "next/link";
import { useLocale } from "next-intl";
import { useTheme } from "next-themes";
import {
  LogOut,
  User,
  Globe,
  Sun,
  Moon,
  Check,
} from "lucide-react";
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
} from "@shared/ui";
import { NotificationBell } from "@features/notifications/presentation/components/notification-bell";
import { useSignOut } from "@shared/hooks/auth/use-auth-hooks";
import { useCurrentEmployeeProfile } from "../../hooks/use-vacation";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ar", label: "العربية", flag: "🇮🇶" },
  { code: "ckb", label: "کوردی", flag: "☀️" },
];

export function EmployeeHeader() {
  const { data: profile } = useCurrentEmployeeProfile();
  const signOutMutation = useSignOut();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const isRtl = useRTL();

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/(en|ar|ckb|ku)/, "");
    window.location.href = `/${newLocale}${pathWithoutLocale}`;
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-card px-4 sm:px-6 shadow-2xs">
      <div>
        <h2 className="text-sm font-semibold text-foreground">
          Employee Self-Service
        </h2>
        <p className="text-[11px] text-muted-foreground hidden sm:block">
          Welcome back, {profile?.fullName || "Employee"}
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Real-time Notifications Bell */}
        <NotificationBell />

        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Globe className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRtl ? "start" : "end"} className="w-36">
            <DropdownMenuLabel className="text-xs">Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                className="flex items-center justify-between text-xs cursor-pointer"
                onClick={() => handleLanguageChange(lang.code)}
              >
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </span>
                {locale === lang.code && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Profile Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 h-8 rounded-full">
              <Avatar className="h-7 w-7 border">
                <AvatarImage src={profile?.avatarUrl || ""} />
                <AvatarFallback className="text-[10px] font-bold">
                  {profile?.fullName ? profile.fullName.slice(0, 2).toUpperCase() : "EM"}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-foreground hidden sm:inline max-w-[120px] truncate">
                {profile?.fullName || "My Account"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRtl ? "start" : "end"} className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-0.5">
                <p className="text-xs font-semibold leading-none">{profile?.fullName}</p>
                <p className="text-[10px] leading-none text-muted-foreground truncate">
                  {profile?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="cursor-pointer text-xs">
                <Link href={`/${locale}/employee/profile`} className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-xs text-destructive focus:text-destructive"
              onClick={() => signOutMutation.mutate()}
            >
              <LogOut className="h-3.5 w-3.5 mr-2" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
