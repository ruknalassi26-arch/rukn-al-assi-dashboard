"use client";
// ==============================================================================
// features/certificates/presentation/components/certificate-details-drawer.tsx
// Certificate Preview & Details Sheet Component
// ==============================================================================
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Shield, Edit, Calendar, Building2, Layers } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Badge,
  Skeleton,
  Separator,
} from "@shared/ui";
import { useCertificateStore } from "../stores/certificate.store";
import { useCertificate } from "@shared/hooks/certificates/use-certificate-hooks";

export function CertificateDetailsDrawer() {
  const t = useTranslations("certificates");
  const tCommon = useTranslations("common");
  const { drawerOpen, selectedCertificateId, closeDrawer } = useCertificateStore();
  const { data: certificate, isLoading } = useCertificate(selectedCertificateId ?? "");

  if (!selectedCertificateId) return null;

  return (
    <Dialog open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-lg font-bold">
              <Shield className="h-5 w-5 text-primary" />
              <span>{t("title")}</span>
            </div>
            {certificate && (
              <Link href={`/admin/certificates/edit/${certificate.id}`} onClick={() => closeDrawer()}>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Edit className="h-4 w-4" /> {tCommon("edit")}
                </Button>
              </Link>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : certificate ? (
          <div className="space-y-6 py-2">
            {/* Header Image */}
            {certificate.image ? (
              <div className="relative h-64 w-full overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={certificate.image}
                  alt={certificate.titleEn}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex h-40 w-full items-center justify-center rounded-lg border bg-muted/40">
                <Shield className="h-16 w-16 text-muted-foreground/40" />
              </div>
            )}

            {/* Titles */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{certificate.titleEn}</h3>
                <Badge variant={certificate.isActive ? "default" : "secondary"}>
                  {certificate.status}
                </Badge>
              </div>
              <p className="text-base font-semibold text-muted-foreground" dir="rtl">
                {certificate.titleAr}
              </p>
              {certificate.titleKu && (
                <p className="text-sm font-medium text-muted-foreground" dir="rtl">
                  ☀️ {certificate.titleKu}
                </p>
              )}
            </div>

            <Separator />

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Issuer / Organization:</span>
                <span>{certificate.organization ?? "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Sort Order:</span>
                <span>{certificate.sortOrder}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Issue Date:</span>
                <span>{certificate.issueDate ?? "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Expiry Date:</span>
                <span className={certificate.isExpired ? "font-bold text-destructive" : ""}>
                  {certificate.expiryDate ?? tCommon("noExpiry")}
                </span>
              </div>
            </div>

            <Separator />

            {/* Descriptions */}
            <div className="space-y-4">
              {certificate.descriptionEn && (
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Description (English)</h4>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{certificate.descriptionEn}</p>
                </div>
              )}
              {certificate.descriptionAr && (
                <div className="space-y-1" dir="rtl">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">الوصف (بالعربية)</h4>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{certificate.descriptionAr}</p>
                </div>
              )}
              {certificate.descriptionKu && (
                <div className="space-y-1" dir="rtl">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Pênase (bi Kurdî)</h4>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{certificate.descriptionKu}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Certificate not found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
