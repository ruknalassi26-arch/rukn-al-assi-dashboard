"use client";
// ==============================================================================
// features/leave-management/presentation/components/shared/no-employee-profile-alert.tsx
// Alert shown when authenticated user does not have an active employee profile
// ==============================================================================

import { UserX } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@shared/ui";
import Link from "next/link";
import { useLocale } from "next-intl";

interface NoEmployeeProfileAlertProps {
  message?: string;
}

export function NoEmployeeProfileAlert({ message }: NoEmployeeProfileAlertProps) {
  const locale = useLocale();

  return (
    <Card className="border-amber-500/30 bg-amber-500/5 max-w-2xl mx-auto my-10 shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3.5 pb-3">
        <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
          <UserX className="h-6 w-6" />
        </div>
        <div>
          <CardTitle className="text-lg font-bold text-foreground">
            This account is not registered as an employee.
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs mt-0.5">
            Employee vacation self-service requires an active employee profile linked to your account.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          {message ||
            "The Vacation & Leave Portal is designed for staff members registered in the employee database. If you require vacation access, please ensure your account is registered as an active employee."}
        </p>

        <div className="flex items-center gap-3 pt-2">
          <Button asChild variant="outline">
            <Link href={`/${locale}/admin`}>Return to Dashboard</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
