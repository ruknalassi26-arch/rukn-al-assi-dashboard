// ==============================================================================
// src/app/[locale]/500/page.tsx
// Custom 500 Page — Internal Server Error
// ==============================================================================
import Link from "next/link";
import { ServerCrash, RefreshCw, Home } from "lucide-react";

export default function InternalServerErrorPage() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
      <div className="rounded-full bg-destructive/10 p-5 text-destructive mb-4">
        <ServerCrash className="h-12 w-12" />
      </div>

      <span className="text-sm font-semibold tracking-wider text-destructive uppercase">
        Error 500
      </span>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Internal Server Error
      </h1>
      <p className="mt-3 max-w-md text-base text-muted-foreground">
        Our servers encountered an unhandled issue. Our engineering team has been notified.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/en"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Home className="h-4 w-4" /> Go to Homepage
        </Link>
      </div>
    </main>
  );
}
