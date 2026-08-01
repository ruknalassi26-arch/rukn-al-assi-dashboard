// ==============================================================================
// src/app/[locale]/(admin)/admin/profile/page.tsx
// My Profile Route Page
// ==============================================================================
import type { Metadata } from "next";
import { ProfilePage } from "@features/profile/presentation/pages";

export const metadata: Metadata = {
  title: "My Profile | Rukn Al Assi Admin",
  description: "Manage your admin user profile and account preferences",
};

export default function AdminProfileRoute() {
  return <ProfilePage />;
}
