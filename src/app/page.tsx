// ==============================================================================
// src/app/page.tsx
// Root redirect — sends users to default locale /en
// ==============================================================================
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/en");
}
