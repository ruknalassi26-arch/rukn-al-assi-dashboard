// ==============================================================================
// app/[locale]/(admin)/admin/careers/postings/page.tsx
// Admin Job Postings Listing Page
// ==============================================================================
import { getTranslations } from "next-intl/server";
import { JobPostingsTable } from "@features/careers/presentation/components/job-postings-table";

export async function generateMetadata() {
  const t = await getTranslations("careersAdmin");
  return {
    title: `${t("postingsTitle")} | Admin Dashboard`,
    description: t("postingsSubtitle"),
  };
}

export default async function AdminJobPostingsPage() {
  const t = await getTranslations("careersAdmin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("postingsTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("postingsSubtitle")}</p>
      </div>

      <JobPostingsTable />
    </div>
  );
}
