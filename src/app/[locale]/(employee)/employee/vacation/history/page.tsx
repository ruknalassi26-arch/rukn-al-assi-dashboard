// ==============================================================================
// app/[locale]/(employee)/employee/vacation/history/page.tsx
// Vacation Request History Page
// ==============================================================================
import { VacationHistoryPage } from "@features/vacation/presentation/pages/vacation-history-page";

export const metadata = {
  title: "Vacation Request History | Employee Portal",
  description: "View past vacation requests and review decisions.",
};

export default function VacationHistoryRoute() {
  return <VacationHistoryPage />;
}
