"use client";
// ==============================================================================
// features/authentication/presentation/pages/reset-password-page.tsx
// ==============================================================================
import React from "react";
import { ResetPasswordForm } from "../components/reset-password-form";

export function ResetPasswordPage() {
  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <ResetPasswordForm />
    </div>
  );
}
