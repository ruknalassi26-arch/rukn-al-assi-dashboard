"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { EmployeeSidebar } from "./employee-sidebar";
import { EmployeeHeader } from "./employee-header";
import { useCurrentEmployeeProfile } from "../../hooks/use-vacation";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@shared/ui";
import { useSignOut } from "@shared/hooks/auth/use-auth-hooks";
import { createClient } from "@core/lib/supabase/client";

interface EmployeeShellProps {
  children: React.ReactNode;
}

export function EmployeeShell({ children }: EmployeeShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname.includes("/employee/login");
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const { data: employeeProfile, isLoading: isProfileLoading } = useCurrentEmployeeProfile();
  const signOutMutation = useSignOut();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (isLoginPage) return;
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setHasSession(false);
        router.replace(`/${locale}/employee/login`);
      } else {
        setHasSession(true);
      }
    });
  }, [isLoginPage, router, locale]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (hasSession === null || (hasSession && isProfileLoading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Loading employee portal...</p>
        </div>
      </div>
    );
  }

  if (hasSession && !isProfileLoading && !employeeProfile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background p-4">
        <div className="max-w-md w-full border rounded-xl p-6 bg-card shadow-lg text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Access Restricted</h2>
            <p className="text-xs text-muted-foreground mt-1">
              This account is not registered as an employee profile in the system.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOutMutation.mutate()}
            className="w-full text-xs"
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Employee Sidebar */}
      <EmployeeSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <EmployeeHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
