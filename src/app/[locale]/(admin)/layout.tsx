// ==============================================================================
// src/app/[locale]/(admin)/layout.tsx
// Protected admin layout shell
// ==============================================================================
import type { ReactNode } from "react";
import { AdminShell } from "@shared/layouts/admin-shell";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminShell>{children}</AdminShell>;
}
