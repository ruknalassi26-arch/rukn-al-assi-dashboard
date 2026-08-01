"use client";
// ==============================================================================
// features/profile/presentation/components/preferences-card.tsx
// Language & Theme Preference Management Card
// ==============================================================================
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Globe, Sun, Moon, Laptop, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Separator,
} from "@shared/ui";
import { toast } from "sonner";

const LANGUAGES = [
  { code: "en", label: "English", native: "English", flag: "🇺🇸" },
  { code: "ar", label: "Arabic", native: "العربية", flag: "🇸🇦" },
  { code: "ckb", label: "Kurdish Sorani", native: "کوردی", flag: "☀️" },
];

export function PreferencesCard() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;
    const pathWithoutLocale = pathname.replace(/^\/(en|ar|ckb|ku)/, "");
    router.push(`/${newLocale}${pathWithoutLocale}`);
    toast.success("Language preference updated");
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Preferences & Localization
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Customize your dashboard language and appearance theme settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Language Preference */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                Interface Language
              </h4>
              <p className="text-xs text-muted-foreground">
                Select your preferred interface language. Supports LTR and RTL directions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === locale;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-start transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                      : "bg-card hover:bg-muted/50 border-input"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{lang.flag}</span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{lang.label}</p>
                      <p className="text-[11px] text-muted-foreground">{lang.native}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Theme Preference */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              Theme Appearance
            </h4>
            <p className="text-xs text-muted-foreground">
              Choose how the admin dashboard looks for you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Light Mode */}
            <button
              type="button"
              onClick={() => {
                setTheme("light");
                toast.success("Switched to Light theme");
              }}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                theme === "light"
                  ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                  : "bg-card hover:bg-muted/50 border-input"
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className="h-5 w-5 text-amber-500" />
                <span className="text-xs font-semibold text-foreground">Light Mode</span>
              </div>
              {theme === "light" && <Check className="h-4 w-4 text-primary shrink-0" />}
            </button>

            {/* Dark Mode */}
            <button
              type="button"
              onClick={() => {
                setTheme("dark");
                toast.success("Switched to Dark theme");
              }}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                theme === "dark"
                  ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                  : "bg-card hover:bg-muted/50 border-input"
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-indigo-400" />
                <span className="text-xs font-semibold text-foreground">Dark Mode</span>
              </div>
              {theme === "dark" && <Check className="h-4 w-4 text-primary shrink-0" />}
            </button>

            {/* System Preference */}
            <button
              type="button"
              onClick={() => {
                setTheme("system");
                toast.success("Switched to System theme");
              }}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                theme === "system"
                  ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                  : "bg-card hover:bg-muted/50 border-input"
              }`}
            >
              <div className="flex items-center gap-3">
                <Laptop className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">System Default</span>
              </div>
              {theme === "system" && <Check className="h-4 w-4 text-primary shrink-0" />}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
