// ==============================================================================
// features/leave-management/presentation/components/shared/no-employee-profile-alert.tsx
// Alert shown when authenticated user does not have an active employee profile
// ==============================================================================

import { AlertTriangle, UserX } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@shared/ui";
import Link from "next/link";
import { useLocale } from "next-intl";

interface NoEmployeeProfileAlertProps {
  message?: string;
}

export function NoEmployeeProfileAlert({ message }: NoEmployeeProfileAlertProps) {
  const locale = useLocale();

  return (
    <Card className="border-amber-500/30 bg-amber-500/5 max-w-2xl mx-auto my-8 shadow-sm">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
          <UserX className="h-6 w-6" />
        </div>
        <div>
          <CardTitle className="text-lg font-semibold text-amber-700 dark:text-amber-400">
            Employee Profile Required
          </CardTitle>
          <CardDescription className="text-amber-600/80 dark:text-amber-400/70">
            Your login account is authenticated, but no active employee profile was found.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          {message ||
            "To apply for leaves and view your balances, an administrator must create and link an employee profile for your account in the system."}
        </p>
        <div className="flex items-center gap-3 pt-2">
          <Button asChild variant="outline">
            <Link href={`/${locale}/admin`}>Return to Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href={`/${locale}/admin/leave-management`}>Go to Leave Management (Admin)</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
