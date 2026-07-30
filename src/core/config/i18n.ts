// ==============================================================================
// core/config/i18n.ts
// next-intl v4 routing configuration (en | ar | ckb)
// ==============================================================================
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar", "ckb"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;

// Arabic and Kurdish Sorani (ckb) use RTL layout (Arabic/Sorani script)
export const RTL_LOCALES: Locale[] = ["ar", "ckb"];

export function isRTL(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}
