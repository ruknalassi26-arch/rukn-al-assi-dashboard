// ==============================================================================
// src/app/[locale]/(admin)/admin/login/page.tsx
// Admin Portal Login page
// ==============================================================================
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign In | Rukn Al Assi",
  description: "Rukn Al Assi Admin Portal Login",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Sign in to Admin</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to access the portal</p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2 text-start">
            <label className="text-sm font-medium text-foreground" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@ruknalassi.com"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2 text-start">
            <label className="text-sm font-medium text-foreground" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
