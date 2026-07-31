// ==============================================================================
// src/app/[locale]/(admin)/admin/contacts/page.tsx
// Admin Contact Information & Branches Route (Plural route matching sidebar)
// ==============================================================================
import type { Metadata } from "next";
import { ContactAdminPage } from "@features/contact/presentation/pages";

export const metadata: Metadata = {
  title: "Contact Information & Branches | Rukn Al Assi Admin",
  description: "Manage main headquarters contact details, phone numbers, addresses, working hours, and company branches.",
};

export default function AdminContactsPage() {
  return <ContactAdminPage />;
}
