// ==============================================================================
// features/categories/domain/enums/category.enums.ts
// Category Status Enums and UI badge variants
// ==============================================================================

export enum CategoryStatusEnum {
  Active = "active",
  Draft = "draft",
}

export const CATEGORY_STATUS_LABELS: Record<CategoryStatusEnum, string> = {
  [CategoryStatusEnum.Active]: "Active",
  [CategoryStatusEnum.Draft]: "Draft",
};

export const CATEGORY_STATUS_VARIANTS: Record<CategoryStatusEnum, "default" | "secondary" | "destructive" | "outline"> = {
  [CategoryStatusEnum.Active]: "default",
  [CategoryStatusEnum.Draft]: "secondary",
};
