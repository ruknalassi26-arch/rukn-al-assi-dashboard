// ==============================================================================
// src/app/[locale]/(admin)/admin/homepage/page.tsx
// Admin Homepage Management page
// ==============================================================================
import type { Metadata } from "next";
import { HomepagePage } from "@features/homepage/presentation/pages/homepage-page";

export const metadata: Metadata = {
  title: "Homepage Management | Rukn Al Assi Admin",
  description: "Manage hero slides, about section, statistics badges, featured items, client partner logos, and contact CTA.",
};

export default function AdminHomepageManagementPage() {
  return <HomepagePage />;
}
