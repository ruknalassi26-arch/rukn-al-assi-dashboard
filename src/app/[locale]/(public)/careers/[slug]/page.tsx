"use client";
// ==============================================================================
// app/[locale]/(public)/careers/[slug]/page.tsx
// Public Job Position Details & Resume Application Submission Page
// ==============================================================================
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  MapPin,
  Building,
  Calendar,
  Briefcase,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@shared/ui";
import { PublicApplicationForm } from "@features/careers/presentation/components/public-application-form";
import { useJobPostingBySlug } from "@shared/hooks/careers/use-career-hooks";
import { ErrorState } from "@shared/components/error-state";
import type { EmploymentType } from "@features/careers/domain/enums/career.enum";

export default function PublicJobDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const locale = useLocale();

  const t = useTranslations("careersPublic");
  const tAdmin = useTranslations("careersAdmin");

  const { data: job, isLoading, error, refetch } = useJobPostingBySlug(slug);

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto py-12 px-4 space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-12 w-3/4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container max-w-3xl mx-auto py-16 px-4">
        <ErrorState
          title="Job Vacancy Not Found"
          error={error ?? new Error("This position may have been closed or archived.")}
          onRetry={() => refetch()}
        />
        <div className="mt-6 text-center">
          <Button asChild variant="outline">
            <Link href={`/${locale}/careers`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {t("backToCareers")}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const getTitle = () => {
    if (locale === "ar") return job.titleAr || job.titleEn;
    if (locale === "ckb") return job.titleKu || job.titleEn;
    return job.titleEn;
  };

  const getDescription = () => {
    if (locale === "ar") return job.descriptionAr || job.descriptionEn;
    if (locale === "ckb") return job.descriptionKu || job.descriptionEn;
    return job.descriptionEn;
  };

  const getRequirements = () => {
    if (locale === "ar") return job.requirementsAr || job.requirementsEn;
    if (locale === "ckb") return job.requirementsKu || job.requirementsEn;
    return job.requirementsEn;
  };

  const getEmploymentTypeBadge = (type: EmploymentType) => {
    switch (type) {
      case "full_time":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30">{tAdmin("types.full_time")}</Badge>;
      case "part_time":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30">{tAdmin("types.part_time")}</Badge>;
      case "contract":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30">{tAdmin("types.contract")}</Badge>;
      case "internship":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">{tAdmin("types.internship")}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const descriptionText = getDescription();
  const requirementsText = getRequirements();

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container max-w-6xl mx-auto px-4 space-y-8">
        {/* Navigation Back Link */}
        <div>
          <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <Link href={`/${locale}/careers`}>
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {t("backToCareers")}
            </Link>
          </Button>
        </div>

        {/* Position Header Banner */}
        <div className="border rounded-2xl p-6 sm:p-8 bg-card shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {getTitle()}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
                {job.department && (
                  <span className="flex items-center gap-1.5">
                    <Building className="h-4 w-4 text-primary shrink-0" />
                    {job.department}
                  </span>
                )}
                {job.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    {job.location}
                  </span>
                )}
                {job.closingDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    {t("closingOn")} {new Date(job.closingDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div>{getEmploymentTypeBadge(job.employmentType)}</div>
          </div>
        </div>

        {/* Main Content Grid: Left Details / Right Apply Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Description & Requirements */}
          <div className="lg:col-span-7 space-y-6">
            {/* Description Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  {t("jobOverview")}
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm">
                {descriptionText || "No additional overview description provided for this opening."}
              </CardContent>
            </Card>

            {/* Requirements Card */}
            {requirementsText && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    {t("requirements")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm">
                  {requirementsText}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Public Application Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-6">
              <PublicApplicationForm jobId={job.id} jobTitle={getTitle()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
