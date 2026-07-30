// ==============================================================================
// src/app/[locale]/(admin)/admin/services/page.tsx
// Admin Services List Route
// ==============================================================================
import type { Metadata } from "next";
import { ServicesListPage } from "@features/services/presentation/pages";

export const metadata: Metadata = {
  title: "Services | Rukn Al Assi Admin",
  description: "Manage service catalog — create, edit, delete, and feature industrial & hydraulic services.",
};

export default function AdminServicesPage() {
  return <ServicesListPage />;
}
