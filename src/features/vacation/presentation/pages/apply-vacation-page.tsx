// ==============================================================================
// features/vacation/presentation/pages/apply-vacation-page.tsx
// Employee page to fill and submit vacation / leave request
// ==============================================================================

"use client";

import Link from "next/link";
import { Button } from "@shared/ui";
import { ArrowLeft } from "lucide-react";
import { RequestVacationForm } from "../components/employee/request-vacation-form";

export function ApplyVacationPage() {
  return (
    <div className="space-y-6">
      {/* Back button header */}
      <div className="flex items-center gap-2">
        <Link href="/employee/vacation">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-8">
            <ArrowLeft className="h-4 w-4" /> Back to Vacation Dashboard
          </Button>
        </Link>
      </div>

      <RequestVacationForm />
    </div>
  );
}
