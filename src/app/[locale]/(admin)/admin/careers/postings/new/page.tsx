// ==============================================================================
// app/[locale]/(admin)/admin/careers/postings/new/page.tsx
// Admin Create Job Posting Page
// ==============================================================================
import { getTranslations } from "next-intl/server";
import { JobPostingForm } from "@features/careers/presentation/components/job-posting-form";

export async function generateMetadata() {
  const t = await getTranslations("careersAdmin");
  return {
    title: `${t("addPosting")} | Admin Dashboard`,
  };
}

export default function CreateJobPostingPage() {
  return <JobPostingForm />;
}
