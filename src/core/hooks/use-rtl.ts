"use client";
// ==============================================================================
// core/hooks/use-rtl.ts
// ==============================================================================
import { useLocale } from "next-intl";
import { isRTL, type Locale } from "@core/config/i18n";

export function useRTL(): boolean {
  const locale = useLocale() as Locale;
  return isRTL(locale);
}
