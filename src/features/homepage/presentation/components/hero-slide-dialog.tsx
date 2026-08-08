"use client";
// ==============================================================================
// features/homepage/presentation/components/hero-slide-dialog.tsx
// Modal dialog form for creating/editing a hero section slide
// ==============================================================================
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui";
import { ImageUploader } from "./image-uploader";
import type { HeroSlideEntity } from "../../domain/entities/homepage.entity";

const heroSlideSchema = z.object({
  titleEn: z.string().min(2, "English title is required"),
  titleAr: z.string().min(2, "Arabic title is required"),
  subtitleEn: z.string().optional().nullable(),
  subtitleAr: z.string().optional().nullable(),
  primaryButtonTextEn: z.string().optional().nullable(),
  primaryButtonTextAr: z.string().optional().nullable(),
  primaryButtonUrl: z.string().optional().nullable(),
  secondaryButtonTextEn: z.string().optional().nullable(),
  secondaryButtonTextAr: z.string().optional().nullable(),
  secondaryButtonUrl: z.string().optional().nullable(),
  backgroundImage: z.string().optional().nullable(),
  overlayOpacity: z.number().min(0).max(1),
  status: z.enum(["active", "draft"]),
  sortOrder: z.number().min(0),
});

type HeroSlideFormValues = z.infer<typeof heroSlideSchema>;

interface HeroSlideDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: HeroSlideFormValues) => Promise<void>;
  initialData?: HeroSlideEntity | null;
  isLoading?: boolean;
}

export function HeroSlideDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: HeroSlideDialogProps) {
  const t = useTranslations("homepageAdmin");
  const tCommon = useTranslations("common");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<HeroSlideFormValues>({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: {
      titleEn: "",
      titleAr: "",
      subtitleEn: "",
      subtitleAr: "",
      primaryButtonTextEn: "",
      primaryButtonTextAr: "",
      primaryButtonUrl: "",
      secondaryButtonTextEn: "",
      secondaryButtonTextAr: "",
      secondaryButtonUrl: "",
      backgroundImage: null,
      overlayOpacity: 0.5,
      status: "active",
      sortOrder: 1,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        titleEn: initialData.titleEn,
        titleAr: initialData.titleAr,
        subtitleEn: initialData.subtitleEn ?? "",
        subtitleAr: initialData.subtitleAr ?? "",
        primaryButtonTextEn: initialData.primaryButtonTextEn ?? "",
        primaryButtonTextAr: initialData.primaryButtonTextAr ?? "",
        primaryButtonUrl: initialData.primaryButtonUrl ?? "",
        secondaryButtonTextEn: initialData.secondaryButtonTextEn ?? "",
        secondaryButtonTextAr: initialData.secondaryButtonTextAr ?? "",
        secondaryButtonUrl: initialData.secondaryButtonUrl ?? "",
        backgroundImage: initialData.backgroundImage,
        overlayOpacity: initialData.overlayOpacity ?? 0.5,
        status: initialData.status,
        sortOrder: initialData.sortOrder,
      });
    } else {
      reset({
        titleEn: "",
        titleAr: "",
        subtitleEn: "",
        subtitleAr: "",
        primaryButtonTextEn: "",
        primaryButtonTextAr: "",
        primaryButtonUrl: "",
        secondaryButtonTextEn: "",
        secondaryButtonTextAr: "",
        secondaryButtonUrl: "",
        backgroundImage: null,
        overlayOpacity: 0.5,
        status: "active",
        sortOrder: 1,
      });
    }
  }, [initialData, reset, isOpen]);

  const backgroundImage = watch("backgroundImage");
  const status = watch("status");

  const onFormSubmit = async (values: HeroSlideFormValues) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? t("editHeroSlide") : t("addHeroSlide")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
          {/* Background Image Uploader */}
          <ImageUploader
            label={t("bgImage")}
            value={backgroundImage ?? null}
            onChange={(url) => setValue("backgroundImage", url)}
            folder="hero"
          />

          {/* Titles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="titleEn">Headline Title (EN) *</Label>
              <Input id="titleEn" {...register("titleEn")} placeholder="Engineering & Industrial Solutions" />
              {errors.titleEn && (
                <span className="text-xs text-destructive">{errors.titleEn.message}</span>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="titleAr">Headline Title (AR) *</Label>
              <Input id="titleAr" dir="rtl" {...register("titleAr")} placeholder="حلول الهيدروليك والهندسة الصناعية" />
              {errors.titleAr && (
                <span className="text-xs text-destructive">{errors.titleAr.message}</span>
              )}
            </div>
          </div>

          {/* Subtitles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="subtitleEn">Subheadline Text (EN)</Label>
              <Textarea id="subtitleEn" rows={2} {...register("subtitleEn")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subtitleAr">Subheadline Text (AR)</Label>
              <Textarea id="subtitleAr" dir="rtl" rows={2} {...register("subtitleAr")} />
            </div>
          </div>

          {/* Primary Button */}
          <div className="border p-3 rounded-lg space-y-3 bg-muted/20">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Primary CTA Button
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Text (EN)</Label>
                <Input size={1} {...register("primaryButtonTextEn")} placeholder="Explore Products" />
              </div>
              <div>
                <Label className="text-xs">Text (AR)</Label>
                <Input size={1} dir="rtl" {...register("primaryButtonTextAr")} placeholder="استكشف المنتجات" />
              </div>
              <div>
                <Label className="text-xs">URL</Label>
                <Input size={1} {...register("primaryButtonUrl")} placeholder="/products" />
              </div>
            </div>
          </div>

          {/* Secondary Button */}
          <div className="border p-3 rounded-lg space-y-3 bg-muted/20">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Secondary CTA Button
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Text (EN)</Label>
                <Input size={1} {...register("secondaryButtonTextEn")} placeholder="Request a Quote" />
              </div>
              <div>
                <Label className="text-xs">Text (AR)</Label>
                <Input size={1} dir="rtl" {...register("secondaryButtonTextAr")} placeholder="طلب عرض سعر" />
              </div>
              <div>
                <Label className="text-xs">URL</Label>
                <Input size={1} {...register("secondaryButtonUrl")} placeholder="/rfq" />
              </div>
            </div>
          </div>

          {/* Status & Sort Order */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{tCommon("status")}</Label>
              <Select value={status} onValueChange={(val: "active" | "draft") => setValue("status", val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{tCommon("active")}</SelectItem>
                  <SelectItem value="draft">{tCommon("draft")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sortOrder">{tCommon("sortOrder")}</Label>
              <Input
                id="sortOrder"
                type="number"
                {...register("sortOrder", { valueAsNumber: true })}
              />
            </div>
          </div>

          <DialogFooter className="mt-6 gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {tCommon("cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? tCommon("save") : t("addHeroSlide")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
