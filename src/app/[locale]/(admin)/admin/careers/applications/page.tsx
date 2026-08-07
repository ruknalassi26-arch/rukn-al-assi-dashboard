// ==============================================================================
// app/[locale]/(admin)/admin/careers/applications/page.tsx
// Admin Career Applications Page
// ==============================================================================
import { getTranslations } from "next-intl/server";
import { CareerApplicationsTable } from "@features/careers/presentation/components/career-applications-table";

export async function generateMetadata() {
  const t = await getTranslations("careersAdmin");
  return {
    title: `${t("applicationsTitle")} | Admin Dashboard`,
    description: t("applicationsSubtitle"),
  };
}

export default async function AdminCareerApplicationsPage() {
  const t = await getTranslations("careersAdmin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("applicationsTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("applicationsSubtitle")}</p>
      </div>

      <CareerApplicationsTable />
    </div>
  );
}
