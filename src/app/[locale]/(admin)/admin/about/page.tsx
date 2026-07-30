// ==============================================================================
// src/app/[locale]/(admin)/admin/about/page.tsx
// Admin About Us Management page
// ==============================================================================
import type { Metadata } from "next";
import { AboutPage } from "@features/about/presentation/pages/about-page";

export const metadata: Metadata = {
  title: "About Us Management | Rukn Al Assi Admin",
  description: "Manage company info, mission, vision, core values, timeline, management team, and certificates.",
};

export default function AboutManagementPage() {
  return <AboutPage />;
}
