import type { ReactNode } from "react";
import { EmployeeShell } from "@features/vacation/presentation/components/employee/employee-shell";

interface EmployeeLayoutProps {
  children: ReactNode;
}

export default function EmployeeLayout({ children }: EmployeeLayoutProps) {
  return <EmployeeShell>{children}</EmployeeShell>;
}
