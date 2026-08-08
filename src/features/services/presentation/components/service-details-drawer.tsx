"use client";
// ==============================================================================
// features/services/presentation/components/service-details-drawer.tsx
// Service Preview & Details Sheet Component
// ==============================================================================
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Wrench, Edit, Calendar, Star, Layers, Tag } from "lucide-react";
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
import { useServiceStore } from "../stores/service.store";
import { useService } from "@shared/hooks/services/use-service-hooks";

export function ServiceDetailsDrawer() {
  const t = useTranslations("services");
  const tCommon = useTranslations("common");
  const { drawerOpen, selectedServiceId, closeDrawer } = useServiceStore();
  const { data: service, isLoading } = useService(selectedServiceId ?? "");

  if (!selectedServiceId) return null;

  return (
    <Dialog open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-lg font-bold">
              <Wrench className="h-5 w-5 text-primary" />
              <span>{t("title")}</span>
            </div>
            {service && (
              <Link href={`/admin/services/edit/${service.id}`} onClick={() => closeDrawer()}>
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
        ) : service ? (
          <div className="space-y-6 py-2">
            {/* Header Image or Icon */}
            {service.image ? (
              <div className="relative h-48 w-full overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={service.image}
                  alt={service.titleEn}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-32 w-full items-center justify-center rounded-lg border bg-muted/40">
                <Wrench className="h-12 w-12 text-muted-foreground/40" />
              </div>
            )}

            {/* Titles */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{service.titleEn}</h3>
                <div className="flex items-center gap-2">
                  {service.isFeatured && (
                    <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-600 gap-1">
                      <Star className="h-3 w-3 fill-amber-500" /> Featured
                    </Badge>
                  )}
                  <Badge variant={service.isActive ? "default" : "secondary"}>
                    {service.status}
                  </Badge>
                </div>
              </div>
              <p className="text-base font-semibold text-muted-foreground" dir="rtl">
                {service.titleAr}
              </p>
              {service.titleKu && (
                <p className="text-sm font-medium text-muted-foreground" dir="rtl">
                  ☀️ {service.titleKu}
                </p>
              )}
            </div>

            <Separator />

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Slug:</span>
                <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono">{service.slug}</code>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Sort Order:</span>
                <span>{service.sortOrder}</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Created:</span>
                <span>{service.createdAt.toLocaleDateString()}</span>
              </div>
            </div>

            <Separator />

            {/* Descriptions */}
            <div className="space-y-4">
              {service.shortDescriptionEn && (
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Short Summary (English)</h4>
                  <p className="text-sm italic text-muted-foreground">{service.shortDescriptionEn}</p>
                </div>
              )}
              {service.descriptionEn && (
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Full Description (English)</h4>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{service.descriptionEn}</p>
                </div>
              )}
              {service.descriptionAr && (
                <div className="space-y-1" dir="rtl">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">الوصف الكامل (بالعربية)</h4>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{service.descriptionAr}</p>
                </div>
              )}
              {service.descriptionKu && (
                <div className="space-y-1" dir="rtl">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Pênaseya bi Kurdî</h4>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{service.descriptionKu}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Service details not found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
