// ==============================================================================
// app/[locale]/(employee)/employee/vacation/page.tsx
// Employee Vacation Dashboard Page
// ==============================================================================
import { EmployeeVacationDashboardPage } from "@features/vacation/presentation/pages/employee-vacation-dashboard-page";

export const metadata = {
  title: "My Vacation & Leave | Employee Portal",
  description: "View vacation balance, submit requests, and track leave status.",
};

export default function EmployeeVacationRoute() {
  return <EmployeeVacationDashboardPage />;
}
