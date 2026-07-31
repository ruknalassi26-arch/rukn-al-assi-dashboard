"use client";
// ==============================================================================
// features/authentication/presentation/pages/forgot-password-page.tsx
// ==============================================================================
import React from "react";
import { ForgotPasswordForm } from "../components/forgot-password-form";

export function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <ForgotPasswordForm />
    </div>
  );
}
