"use client";
// ==============================================================================
// features/team/presentation/pages/team-members-list-page.tsx
// Main Team Members Management Page
// ==============================================================================
import { TeamMemberTable } from "../components/team-member-table";
import { TeamMemberDetailsDrawer } from "../components/team-member-details-drawer";

export function TeamMembersListPage() {
  return (
    <div className="space-y-6">
      <TeamMemberTable />
      <TeamMemberDetailsDrawer />
    </div>
  );
}
