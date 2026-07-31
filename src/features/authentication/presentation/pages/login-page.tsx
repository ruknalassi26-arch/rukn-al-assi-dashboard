"use client";
// ==============================================================================
// features/authentication/presentation/pages/login-page.tsx
// ==============================================================================
import React from "react";
import { LoginForm } from "../components/login-form";

export function LoginPage() {
  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
