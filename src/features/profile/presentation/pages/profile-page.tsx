"use client";
// ==============================================================================
// features/profile/presentation/pages/profile-page.tsx
// Main My Profile Admin Page
// ==============================================================================
import { User, KeyRound, Edit3, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger, Skeleton, Card, CardContent } from "@shared/ui";
import { useProfileQuery } from "@shared/hooks/profile/use-profile-hooks";
import { useProfileStore, type ProfileTab } from "../stores/profile.store";
import { AvatarUploader } from "../components/avatar-uploader";
import { ProfileDetailsCard } from "../components/profile-details-card";
import { EditProfileForm } from "../components/edit-profile-form";
import { ChangePasswordForm } from "../components/change-password-form";

export function ProfilePage() {
  const { data: user, isLoading, isError, error } = useProfileQuery();
  const { activeTab, setActiveTab } = useProfileStore();

  if (isLoading) {
    return (
      <div className="space-y-6 p-6 max-w-5xl mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-36 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-6 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Error Loading User Profile</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {error?.message || "Failed to load user profile. Please sign in again."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            My Profile
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your admin profile details, security credentials, and avatar image.
          </p>
        </div>
      </div>

      {/* Avatar Uploader Section */}
      <AvatarUploader user={user} />

      {/* Main Feature Tabs */}
      <Tabs value={activeTab} onValueChange={(val: string) => setActiveTab(val as ProfileTab)} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md h-auto p-1 bg-muted/60 rounded-xl">
          <TabsTrigger value="details" className="gap-2 text-xs py-2.5 rounded-lg">
            <User className="h-4 w-4" />
            Profile Details
          </TabsTrigger>
          <TabsTrigger value="edit" className="gap-2 text-xs py-2.5 rounded-lg">
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </TabsTrigger>
          <TabsTrigger value="password" className="gap-2 text-xs py-2.5 rounded-lg">
            <KeyRound className="h-4 w-4" />
            Change Password
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Profile Details */}
        <TabsContent value="details">
          <ProfileDetailsCard user={user} />
        </TabsContent>

        {/* Tab 2: Edit Profile */}
        <TabsContent value="edit">
          <EditProfileForm user={user} onSuccess={() => setActiveTab("details")} />
        </TabsContent>

        {/* Tab 3: Change Password */}
        <TabsContent value="password">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
