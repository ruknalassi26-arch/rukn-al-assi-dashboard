// ==============================================================================
// features/categories/domain/enums/category.enums.ts
// Category Status Enums matching DB constraint ('published', 'draft', 'archived')
// ==============================================================================

export enum CategoryStatusEnum {
  Published = "published",
  Draft = "draft",
  Archived = "archived",
}

export const CATEGORY_STATUS_LABELS: Record<CategoryStatusEnum, string> = {
  [CategoryStatusEnum.Published]: "Published",
  [CategoryStatusEnum.Draft]: "Draft",
  [CategoryStatusEnum.Archived]: "Archived",
};

export const CATEGORY_STATUS_VARIANTS: Record<CategoryStatusEnum, "default" | "secondary" | "destructive" | "outline"> = {
  [CategoryStatusEnum.Published]: "default",
  [CategoryStatusEnum.Draft]: "secondary",
  [CategoryStatusEnum.Archived]: "destructive",
};
