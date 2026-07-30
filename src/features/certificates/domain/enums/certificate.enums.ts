// ==============================================================================
// features/certificates/domain/enums/certificate.enums.ts
// Certificate Status Enums & UI variants
// ==============================================================================

export enum CertificateStatusEnum {
  Active = "active",
  Draft = "draft",
}

export const CERTIFICATE_STATUS_LABELS: Record<CertificateStatusEnum, string> = {
  [CertificateStatusEnum.Active]: "Active",
  [CertificateStatusEnum.Draft]: "Draft",
};

export const CERTIFICATE_STATUS_VARIANTS: Record<CertificateStatusEnum, "default" | "secondary" | "destructive" | "outline"> = {
  [CertificateStatusEnum.Active]: "default",
  [CertificateStatusEnum.Draft]: "secondary",
};
