// ==============================================================================
// features/vacation/presentation/pages/employee-profile-page.tsx
// Employee Profile & Employment Details View
// ==============================================================================

"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Skeleton,
} from "@shared/ui";
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { useCurrentEmployeeProfile } from "../hooks/use-vacation";

export function EmployeeProfilePage() {
  const { data: profile, isLoading, error } = useCurrentEmployeeProfile();

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-8 text-center border rounded-xl bg-card">
        <User className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
        <h2 className="text-base font-semibold">Employee Profile Not Found</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Your account is not linked to an employee profile yet. Please contact your administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header Banner */}
      <Card className="shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 border-b" />
        <CardContent className="relative pt-0 pb-6 px-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
            <Avatar className="h-24 w-24 rounded-full border-4 border-card shadow-md">
              <AvatarImage src={profile.avatarUrl || ""} />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {profile.fullName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">{profile.fullName}</h1>
                {profile.isActive ? (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] w-fit mx-auto sm:mx-0">
                    Active Staff
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] w-fit mx-auto sm:mx-0">
                    Inactive
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {profile.jobTitle || "Employee"}{" "}
                {profile.department && `• ${profile.department}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details Grid */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Employment & Contact Information
          </CardTitle>
          <CardDescription className="text-xs">
            Personal and organization details registered in the company system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
              <span className="text-muted-foreground text-[11px] flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email Address
              </span>
              <p className="font-semibold text-foreground">{profile.email}</p>
            </div>

            <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
              <span className="text-muted-foreground text-[11px] flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> Phone Number
              </span>
              <p className="font-semibold text-foreground font-mono">
                {profile.phone || "Not specified"}
              </p>
            </div>

            <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
              <span className="text-muted-foreground text-[11px] flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" /> Department
              </span>
              <p className="font-semibold text-foreground">
                {profile.department || "Unassigned"}
              </p>
            </div>

            <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
              <span className="text-muted-foreground text-[11px] flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5" /> Job Title
              </span>
              <p className="font-semibold text-foreground">
                {profile.jobTitle || "Not specified"}
              </p>
            </div>

            <div className="p-3 rounded-lg border bg-muted/20 space-y-1 sm:col-span-2">
              <span className="text-muted-foreground text-[11px] flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Employment Start Date
              </span>
              <p className="font-semibold text-foreground font-mono">
                {profile.employmentStartDate || "Not registered"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
