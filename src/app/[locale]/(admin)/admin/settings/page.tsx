// ==============================================================================
// src/app/[locale]/(admin)/admin/settings/page.tsx
// Admin Website Settings & Branding Route
// ==============================================================================
import type { Metadata } from "next";
import { SettingsPage } from "@features/settings/presentation/pages";

export const metadata: Metadata = {
  title: "Website Settings & Branding | Rukn Al Assi Admin",
  description: "Configure website settings, company details, contact channels, social media profiles, and logo branding assets.",
};

export default function AdminSettingsPage() {
  return <SettingsPage />;
}
