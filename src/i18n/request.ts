// ==============================================================================
// src/i18n/request.ts
// Standard next-intl v4 request configuration
// ==============================================================================
import { getRequestConfig } from "next-intl/server";
import { routing } from "@core/config/i18n";

import arMessages from "../../messages/ar.json";
import enMessages from "../../messages/en.json";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  const messages = locale === "ar" ? arMessages : enMessages;

  return {
    locale,
    messages,
  };
});
