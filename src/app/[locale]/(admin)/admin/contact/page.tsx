// ==============================================================================
// src/app/[locale]/(admin)/admin/contact/page.tsx
// Admin Contact Information & Branches Route
// ==============================================================================
import type { Metadata } from "next";
import { ContactAdminPage } from "@features/contact/presentation/pages";

export const metadata: Metadata = {
  title: "Contact Information & Branches | Rukn Al Assi Admin",
  description: "Manage main headquarters contact details, phone numbers, addresses, working hours, and company branches.",
};

export default function AdminContactPage() {
  return <ContactAdminPage />;
}
