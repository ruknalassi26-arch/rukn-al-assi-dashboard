// ==============================================================================
// features/team/domain/enums/team.enums.ts
// Team Member Status Enums & UI variants
// ==============================================================================

export enum TeamMemberStatusEnum {
  Active = "active",
  Draft = "draft",
}

export const TEAM_STATUS_LABELS: Record<TeamMemberStatusEnum, string> = {
  [TeamMemberStatusEnum.Active]: "Active",
  [TeamMemberStatusEnum.Draft]: "Draft",
};

export const TEAM_STATUS_VARIANTS: Record<TeamMemberStatusEnum, "default" | "secondary" | "destructive" | "outline"> = {
  [TeamMemberStatusEnum.Active]: "default",
  [TeamMemberStatusEnum.Draft]: "secondary",
};
