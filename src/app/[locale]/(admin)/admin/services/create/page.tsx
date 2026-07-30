// ==============================================================================
// src/app/[locale]/(admin)/admin/services/create/page.tsx
// Admin Create Service Route
// ==============================================================================
import type { Metadata } from "next";
import { CreateServicePage } from "@features/services/presentation/pages";

export const metadata: Metadata = {
  title: "Create Service | Rukn Al Assi Admin",
  description: "Add a new hydraulic service with multilingual English, Arabic, and Kurdish content.",
};

export default function AdminCreateServicePage() {
  return <CreateServicePage />;
}
