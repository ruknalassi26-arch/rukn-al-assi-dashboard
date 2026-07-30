// ==============================================================================
// src/app/[locale]/(public)/page.tsx
// Public home page
// ==============================================================================
import type { Metadata } from "next";
import { siteConfig } from "@core/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default function HomePage() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl space-y-4">
        <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
          Rukn Al Assi Hydraulic Services
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {siteConfig.name}
        </h1>
        <p className="text-lg text-muted-foreground">
          {siteConfig.description}
        </p>
        <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/en/admin"
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            Admin Portal
          </a>
          <a
            href="/api/health"
            className="rounded-md border border-input bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            API Health Check
          </a>
        </div>
      </div>
    </main>
  );
}
