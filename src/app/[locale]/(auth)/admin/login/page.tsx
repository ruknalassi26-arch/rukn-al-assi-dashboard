// ==============================================================================
// src/app/[locale]/(auth)/admin/login/page.tsx
// Admin Standalone Login Route
// ==============================================================================
import type { Metadata } from "next";
import { LoginPage } from "@features/authentication/presentation/pages";

export const metadata: Metadata = {
  title: "Admin Sign In | Rukn Al Assi",
  description: "Rukn Al Assi Admin Portal Login",
};

export default function AdminLoginRoute() {
  return <LoginPage />;
}
