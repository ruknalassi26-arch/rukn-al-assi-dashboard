// ==============================================================================
// src/app/[locale]/(public)/page.tsx
// Public root route — redirects directly to locale admin portal
// ==============================================================================
import { redirect } from "next/navigation";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  redirect(`/${locale}/admin`);
}
