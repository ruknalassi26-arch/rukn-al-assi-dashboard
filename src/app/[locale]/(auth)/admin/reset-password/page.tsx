// ==============================================================================
// src/app/[locale]/(auth)/admin/reset-password/page.tsx
// Admin Standalone Reset Password Route
// ==============================================================================
import type { Metadata } from "next";
import { ResetPasswordPage } from "@features/authentication/presentation/pages";

export const metadata: Metadata = {
  title: "Reset Password | Rukn Al Assi Admin",
  description: "Set a new password for your Rukn Al Assi admin account",
};

export default function AdminResetPasswordRoute() {
  return <ResetPasswordPage />;
}
