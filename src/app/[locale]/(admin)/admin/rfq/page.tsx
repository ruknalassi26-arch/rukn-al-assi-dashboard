// ==============================================================================
// src/app/[locale]/(admin)/admin/rfq/page.tsx
// Admin RFQ Requests List Route
// ==============================================================================
import type { Metadata } from "next";
import { RfqListPage } from "@features/rfq/presentation/pages";

export const metadata: Metadata = {
  title: "RFQ Requests | Rukn Al Assi Admin",
  description: "View and process customer quotation requests, download attachments, and send email replies.",
};

export default function AdminRfqPage() {
  return <RfqListPage />;
}
