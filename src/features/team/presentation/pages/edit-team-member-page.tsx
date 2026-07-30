"use client";
// ==============================================================================
// features/team/presentation/pages/edit-team-member-page.tsx
// ==============================================================================
import { TeamMemberForm } from "../components/team-member-form";
import { useTeamMember } from "@shared/hooks/team/use-team-hooks";
import { Skeleton, Card, CardHeader, CardContent } from "@shared/ui";
import { ErrorState } from "@shared/components/error-state";

interface EditTeamMemberPageProps {
  memberId: string;
}

export function EditTeamMemberPage({ memberId }: EditTeamMemberPageProps) {
  const { data: member, isLoading, error, refetch } = useTeamMember(memberId);

  if (isLoading) {
    return (
      <Card className="max-w-5xl mx-auto">
        <CardHeader><Skeleton className="h-8 w-64" /></CardHeader>
        <CardContent className="space-y-4"><Skeleton className="h-64 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !member) {
    return (
      <ErrorState
        title="Team member not found"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return <TeamMemberForm initialData={member} />;
}
