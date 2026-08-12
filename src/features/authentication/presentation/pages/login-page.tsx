"use client";
// ==============================================================================
// features/authentication/presentation/pages/login-page.tsx
// ==============================================================================
import React, { Suspense } from "react";
import { LoginForm } from "../components/login-form";

export function LoginPage() {
  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <Suspense fallback={<div className="p-4 text-xs text-muted-foreground">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
