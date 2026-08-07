// ==============================================================================
// app/[locale]/(admin)/admin/roles/page.tsx
// Admin Roles & Permissions Management Page
// ==============================================================================
import { getTranslations } from "next-intl/server";
import { RoleListTable } from "@features/roles-permissions/presentation/components/role-list-table";

export async function generateMetadata() {
  const t = await getTranslations("rolesAdmin");
  return {
    title: `${t("title")} | Admin Dashboard`,
    description: t("subtitle"),
  };
}

export default async function AdminRolesPage() {
  const t = await getTranslations("rolesAdmin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <RoleListTable />
    </div>
  );
}
