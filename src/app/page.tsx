// ==============================================================================
// src/app/page.tsx
// Root redirect — sends users directly to admin portal /en/admin
// ==============================================================================
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/en/admin");
}
