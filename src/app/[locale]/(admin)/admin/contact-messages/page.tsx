// ==============================================================================
// src/app/[locale]/(admin)/admin/contact-messages/page.tsx
// Admin Contact Messages Inbox Route
// ==============================================================================
import type { Metadata } from "next";
import { ContactMessagesListPage } from "@features/contact-messages/presentation/pages";

export const metadata: Metadata = {
  title: "Contact Messages Inbox | Rukn Al Assi Admin",
  description: "View customer inquiry messages submitted from the public website contact form, reply by email, and manage statuses.",
};

export default function AdminContactMessagesPage() {
  return <ContactMessagesListPage />;
}
