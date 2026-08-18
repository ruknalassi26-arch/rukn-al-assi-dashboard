// ==============================================================================
// app/[locale]/(employee)/employee/profile/page.tsx
// Employee Profile Page
// ==============================================================================
import { EmployeeProfilePage } from "@features/vacation/presentation/pages/employee-profile-page";

export const metadata = {
  title: "My Profile | Employee Portal",
  description: "View your employee profile and employment details.",
};

export default function EmployeeProfileRoute() {
  return <EmployeeProfilePage />;
}
