// ==============================================================================
// app/[locale]/(employee)/employee/vacation/apply/page.tsx
// Apply for Vacation Page
// ==============================================================================
import { ApplyVacationPage } from "@features/vacation/presentation/pages/apply-vacation-page";

export const metadata = {
  title: "Apply for Leave | Employee Portal",
  description: "Submit a new vacation or time off request.",
};

export default function ApplyVacationRoute() {
  return <ApplyVacationPage />;
}
