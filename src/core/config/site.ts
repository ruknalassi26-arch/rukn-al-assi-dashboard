// ==============================================================================
// core/config/site.ts
// Static site-wide configuration
// ==============================================================================

export const siteConfig = {
  name: "Rukn Al Assi",
  nameAr: "ركن العاصي",
  tagline: "Hydraulic Services",
  taglineAr: "خدمات هيدروليكية",
  url: process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000",
  siteUrl: process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://ruknalassi.com",
  description:
    "Rukn Al Assi provides premium hydraulic services, equipment, and solutions across the region.",
  descriptionAr:
    "ركن العاصي يقدم خدمات هيدروليكية متميزة ومعدات وحلولاً متكاملة في المنطقة.",
  email: "info@ruknalassi.com",
  phone: "+966 XX XXX XXXX",
  address: "Riyadh, Saudi Arabia",
  social: {
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
    youtube: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
