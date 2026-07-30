// ==============================================================================
// features/contact/domain/enums/contact.enums.ts
// Contact Status Enums & UI variants
// ==============================================================================

export enum BranchStatusEnum {
  Active = "active",
  Draft = "draft",
}

export const BRANCH_STATUS_LABELS: Record<BranchStatusEnum, string> = {
  [BranchStatusEnum.Active]: "Active",
  [BranchStatusEnum.Draft]: "Draft",
};

export const BRANCH_STATUS_VARIANTS: Record<BranchStatusEnum, "default" | "secondary" | "destructive" | "outline"> = {
  [BranchStatusEnum.Active]: "default",
  [BranchStatusEnum.Draft]: "secondary",
};
