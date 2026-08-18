// ==============================================================================
// src/app/[locale]/(employee)/employee/login/page.tsx
// Employee Portal Login Route
// ==============================================================================
import { EmployeeLoginCard } from "@features/vacation/presentation/components/employee/employee-login-card";

export const metadata = {
  title: "Employee Login | Rukn Al Assi",
  description: "Sign in to access your employee leave dashboard and profile.",
};

export default function EmployeeLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/20">
      <EmployeeLoginCard />
    </div>
  );
}
