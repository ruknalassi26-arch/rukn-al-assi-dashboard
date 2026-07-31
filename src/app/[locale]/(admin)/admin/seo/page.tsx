// ==============================================================================
// src/app/[locale]/(admin)/admin/seo/page.tsx
// Admin SEO Settings Route
// ==============================================================================
import type { Metadata } from "next";
import { SeoPage } from "@features/seo/presentation/pages";

export const metadata: Metadata = {
  title: "SEO Settings | Rukn Al Assi Admin",
  description: "Configure search engine titles, meta descriptions, keywords, Open Graph social images, and indexing per public page.",
};

export default function AdminSeoPage() {
  return <SeoPage />;
}
