"use client";
// ==============================================================================
// features/homepage/presentation/components/hero-section-manager.tsx
// Hero Section management component (Create, Edit, Delete, Reorder, Preview)
// ==============================================================================
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Plus, Pencil, Trash2, Eye, ArrowUp, ArrowDown, ImageIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  Skeleton,
} from "@shared/ui";
import {
  useHeroSlides,
  useCreateHeroSlide,
  useUpdateHeroSlide,
  useDeleteHeroSlide,
  useReorderHeroSlides,
} from "@shared/hooks/homepage/use-homepage-hooks";
import { HeroSlideDialog } from "@shared/dialogs/hero-slide-dialog";
import { HeroPreviewDialog } from "@shared/dialogs/hero-preview-dialog";
import { ConfirmDialog } from "@shared/dialogs/confirm-dialog";
import { EmptyState } from "@shared/components/empty-state";
import { ErrorState } from "@shared/components/error-state";
import type { HeroSlideEntity } from "../../domain/entities/homepage.entity";

export function HeroSectionManager() {
  const t = useTranslations("homepageAdmin");
  const tCommon = useTranslations("common");
  const { data: slides, isLoading, error, refetch } = useHeroSlides();
  const createMutation = useCreateHeroSlide();
  const updateMutation = useUpdateHeroSlide();
  const deleteMutation = useDeleteHeroSlide();
  const reorderMutation = useReorderHeroSlides();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlideEntity | null>(null);
  const [previewSlide, setPreviewSlide] = useState<HeroSlideEntity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingSlide(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (slide: HeroSlideEntity) => {
    setEditingSlide(slide);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (values: Record<string, unknown>) => {
    if (editingSlide) {
      await updateMutation.mutateAsync({
        id: editingSlide.id,
        slide: values as Partial<HeroSlideEntity>,
      });
    } else {
      await createMutation.mutateAsync(values as Omit<HeroSlideEntity, "id" | "createdAt" | "updatedAt">);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    await deleteMutation.mutateAsync(deletingId);
    setDeletingId(null);
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (!slides) return;
    const newSlides = [...slides];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSlides.length) return;

    const [moved] = newSlides.splice(index, 1);
    newSlides.splice(targetIndex, 0, moved);

    await reorderMutation.mutateAsync(newSlides.map((s) => s.id));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load hero slides"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("heroTitle")}</CardTitle>
            <CardDescription>
              {t("heroSubtitle")}
            </CardDescription>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="h-4 w-4" /> {t("addHeroSlide")}
          </Button>
        </CardHeader>

        <CardContent>
          {!slides || slides.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title={t("noSlidesTitle")}
              description={t("noSlidesDescription")}
              action={
                <Button onClick={handleOpenCreate} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" /> {t("addHeroSlide")}
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border bg-card hover:shadow-sm transition-all gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Thumbnail */}
                    <div className="relative h-16 w-24 rounded-md overflow-hidden bg-muted shrink-0 border">
                      {slide.backgroundImage ? (
                        <Image
                          src={slide.backgroundImage}
                          alt={slide.titleEn}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Titles */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-foreground truncate">
                          {slide.titleEn}
                        </h4>
                        <Badge variant={slide.status === "active" ? "default" : "secondary"}>
                          {slide.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate" dir="rtl">
                        {slide.titleAr}
                      </p>
                      {slide.subtitleEn && (
                        <p className="text-xs text-muted-foreground/80 truncate max-w-md">
                          {slide.subtitleEn}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    {/* Reorder Buttons */}
                    <div className="flex items-center me-2 border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={index === 0 || reorderMutation.isPending}
                        onClick={() => handleMove(index, "up")}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={index === slides.length - 1 || reorderMutation.isPending}
                        onClick={() => handleMove(index, "down")}
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewSlide(slide)}
                      className="gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5 text-cyan-600" /> Preview
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(slide)}
                      className="gap-1.5"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingId(slide.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <HeroSlideDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingSlide}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Live Preview Dialog */}
      <HeroPreviewDialog
        isOpen={!!previewSlide}
        onClose={() => setPreviewSlide(null)}
        slides={previewSlide ? [previewSlide] : slides ?? []}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Hero Slide"
        description="Are you sure you want to delete this hero slide? This action cannot be undone."
        confirmText="Delete Slide"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
