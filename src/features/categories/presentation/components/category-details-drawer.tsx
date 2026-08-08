"use client";
// ==============================================================================
// features/categories/presentation/components/category-details-drawer.tsx
// Category Preview & Details Sheet Component
// ==============================================================================
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FolderKanban, Edit, Calendar, Tag, Layers } from "lucide-react";
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
import { useCategoryStore } from "../stores/category.store";
import { useCategory } from "@shared/hooks/categories/use-category-hooks";

export function CategoryDetailsDrawer() {
  const t = useTranslations("categories");
  const tCommon = useTranslations("common");
  const { drawerOpen, selectedCategoryId, closeDrawer } = useCategoryStore();
  const { data: category, isLoading } = useCategory(selectedCategoryId ?? "");

  if (!selectedCategoryId) return null;

  return (
    <Dialog open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-lg font-bold">
              <FolderKanban className="h-5 w-5 text-primary" />
              <span>{t("title")}</span>
            </div>
            {category && (
              <Link href={`/admin/categories/edit/${category.id}`} onClick={() => closeDrawer()}>
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
        ) : category ? (
          <div className="space-y-6 py-2">
            {/* Header Image or Icon */}
            {category.image ? (
              <div className="relative h-48 w-full overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={category.image}
                  alt={category.nameEn}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-32 w-full items-center justify-center rounded-lg border bg-muted/40">
                <FolderKanban className="h-12 w-12 text-muted-foreground/40" />
              </div>
            )}

            {/* Names */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{category.nameEn}</h3>
                <Badge variant={category.isActive ? "default" : "secondary"}>
                  {category.status}
                </Badge>
              </div>
              <p className="text-base font-semibold text-muted-foreground" dir="rtl">
                {category.nameAr}
              </p>
              {category.nameKu && (
                <p className="text-sm font-medium text-muted-foreground" dir="rtl">
                  ☀️ {category.nameKu}
                </p>
              )}
            </div>

            <Separator />

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Slug:</span>
                <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono">{category.slug}</code>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Sort Order:</span>
                <span>{category.sortOrder}</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Created:</span>
                <span>{category.createdAt.toLocaleDateString()}</span>
              </div>
            </div>

            <Separator />

            {/* Descriptions */}
            <div className="space-y-4">
              {category.descriptionEn && (
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">English Description</h4>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{category.descriptionEn}</p>
                </div>
              )}
              {category.descriptionAr && (
                <div className="space-y-1" dir="rtl">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">الوصف بالعربية</h4>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{category.descriptionAr}</p>
                </div>
              )}
              {category.descriptionKu && (
                <div className="space-y-1" dir="rtl">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Pênaseya bi Kurdî</h4>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{category.descriptionKu}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Category not found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
