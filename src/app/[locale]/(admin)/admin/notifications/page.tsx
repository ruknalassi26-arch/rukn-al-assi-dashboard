// ==============================================================================
// src/app/[locale]/(admin)/admin/notifications/page.tsx
// Admin Notification Center Route Page
// ==============================================================================
import type { Metadata } from "next";
import { NotificationsPage } from "@features/notifications/presentation/pages";

export const metadata: Metadata = {
  title: "Notification Center | Rukn Al Assi Admin",
  description: "Real-time notifications for quotation requests, messages, and system alerts",
};

export default function AdminNotificationsRoute() {
  return <NotificationsPage />;
}
