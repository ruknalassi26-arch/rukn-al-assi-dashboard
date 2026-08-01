// ==============================================================================
// src/app/[locale]/(auth)/admin/forgot-password/page.tsx
// Admin Standalone Forgot Password Route
// ==============================================================================
import type { Metadata } from "next";
import { ForgotPasswordPage } from "@features/authentication/presentation/pages";

export const metadata: Metadata = {
  title: "Forgot Password | Rukn Al Assi Admin",
  description: "Reset your Rukn Al Assi admin password",
};

export default function AdminForgotPasswordRoute() {
  return <ForgotPasswordPage />;
}
