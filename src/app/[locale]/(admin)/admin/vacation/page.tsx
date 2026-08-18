// ==============================================================================
// app/[locale]/(admin)/admin/vacation/page.tsx
// Admin Vacation & Leave Management Page
// ==============================================================================
import { AdminVacationPage } from "@features/vacation/presentation/pages/admin-vacation-page";

export const metadata = {
  title: "Vacation & Leave Management | Admin Dashboard",
  description: "Manage employee vacation requests, review and approve leave applications.",
};

export default function AdminVacationRoute() {
  return <AdminVacationPage />;
}
