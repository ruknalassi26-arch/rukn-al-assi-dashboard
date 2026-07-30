// ==============================================================================
// src/app/[locale]/forbidden/page.tsx
// Custom 403 Page — Access Denied / Insufficient Permissions
// ==============================================================================
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
      <div className="rounded-full bg-destructive/10 p-5 text-destructive mb-4">
        <ShieldAlert className="h-12 w-12" />
      </div>

      <span className="text-sm font-semibold tracking-wider text-destructive uppercase">
        Error 403
      </span>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Access Denied
      </h1>
      <p className="mt-3 max-w-md text-base text-muted-foreground">
        You do not have the required permissions to view this resource. If you believe this is an error, please contact your administrator.
      </p>

      <div className="mt-8 flex items-center justify-center gap-4">
        <Link
          href="/en"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Safety
        </Link>
      </div>
    </main>
  );
}
