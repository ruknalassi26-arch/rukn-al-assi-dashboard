// ==============================================================================
// features/services/domain/enums/service.enums.ts
// Service Status Enums & UI variants
// ==============================================================================

export enum ServiceStatusEnum {
  Active = "active",
  Draft = "draft",
}

export const SERVICE_STATUS_LABELS: Record<ServiceStatusEnum, string> = {
  [ServiceStatusEnum.Active]: "Active",
  [ServiceStatusEnum.Draft]: "Draft",
};

export const SERVICE_STATUS_VARIANTS: Record<ServiceStatusEnum, "default" | "secondary" | "destructive" | "outline"> = {
  [ServiceStatusEnum.Active]: "default",
  [ServiceStatusEnum.Draft]: "secondary",
};
