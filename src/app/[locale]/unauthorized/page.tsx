// ==============================================================================
// src/app/[locale]/unauthorized/page.tsx
// Custom 401 Page — Authentication Required
// ==============================================================================
import Link from "next/link";
import { Lock, LogIn, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
      <div className="rounded-full bg-amber-500/10 p-5 text-amber-600 dark:text-amber-400 mb-4">
        <Lock className="h-12 w-12" />
      </div>

      <span className="text-sm font-semibold tracking-wider text-amber-600 uppercase">
        Error 401
      </span>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Authentication Required
      </h1>
      <p className="mt-3 max-w-md text-base text-muted-foreground">
        Your session has expired or you are not logged in. Please sign in to access this page.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/en/admin/login"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          <LogIn className="h-4 w-4" /> Sign In
        </Link>
        <Link
          href="/en"
          className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Home
        </Link>
      </div>
    </main>
  );
}
