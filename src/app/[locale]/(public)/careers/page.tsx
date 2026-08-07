"use client";
// ==============================================================================
// app/[locale]/(public)/careers/page.tsx
// Public Client Website Careers Opportunities Listing Page
// ==============================================================================
import { useTranslations } from "next-intl";
import { Briefcase, Loader2 } from "lucide-react";
import { PublicJobCard } from "@features/careers/presentation/components/public-job-card";
import { usePublishedJobPostings } from "@shared/hooks/careers/use-career-hooks";
import { Skeleton } from "@shared/ui";

export default function PublicCareersPage() {
  const t = useTranslations("careersPublic");
  const { data: jobs, isLoading, error, refetch } = usePublishedJobPostings();

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container max-w-6xl mx-auto px-4 space-y-12">
        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Briefcase className="h-3.5 w-3.5" /> Join Our Team
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Postings Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold tracking-tight">{t("openPositions")}</h2>
            <span className="text-sm text-muted-foreground">
              {jobs?.length ?? 0} active openings
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="border rounded-xl p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 border rounded-xl bg-card">
              <p className="text-destructive font-medium">Failed to load career opportunities.</p>
              <button onClick={() => refetch()} className="text-sm text-primary underline mt-2">
                Try Refreshing
              </button>
            </div>
          ) : jobs?.length === 0 ? (
            <div className="text-center py-16 border rounded-xl bg-card/50 space-y-3">
              <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto" />
              <h3 className="text-xl font-semibold">{t("noJobsTitle")}</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {t("noJobsDesc")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs?.map((job) => (
                <PublicJobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
