// ==============================================================================
// app/[locale]/(admin)/admin/users/page.tsx
// Admin Users & Personnel Management Page
// ==============================================================================
import { getTranslations } from "next-intl/server";
import { UserListTable } from "@features/roles-permissions/presentation/components/user-list-table";

export async function generateMetadata() {
  const t = await getTranslations("usersAdmin");
  return {
    title: `${t("title")} | Admin Dashboard`,
    description: t("subtitle"),
  };
}

export default async function AdminUsersPage() {
  const t = await getTranslations("usersAdmin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <UserListTable />
    </div>
  );
}
