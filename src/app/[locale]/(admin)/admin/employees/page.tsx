// ==============================================================================
// app/[locale]/(admin)/admin/employees/page.tsx
// Admin Employee Directory Page
// ==============================================================================
import { AdminEmployeesPage } from "@features/vacation/presentation/pages/admin-employees-page";

export const metadata = {
  title: "Employee Directory | Admin Dashboard",
  description: "View staff members, department assignments, and contact details.",
};

export default function AdminEmployeesRoute() {
  return <AdminEmployeesPage />;
}
