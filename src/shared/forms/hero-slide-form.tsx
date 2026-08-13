"use client";
// ==============================================================================
// shared/forms/hero-slide-form.tsx
// Full-page Form Component for Creating / Editing Homepage Hero Banner Slides
// ==============================================================================
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { MultilingualTabs } from "@shared/components/multilingual-tabs";
import { ImageUploader } from "@shared/upload/image-uploader";
import type { HeroSlideEntity } from "@features/homepage/domain/entities/homepage.entity";

const heroSlideSchema = z.object({
  titleEn: z.string().min(2, "English title is required"),
  titleAr: z.string().min(2, "Arabic title is required"),
  titleKu: z.string().optional().nullable(),
  subtitleEn: z.string().optional().nullable(),
  subtitleAr: z.string().optional().nullable(),
  subtitleKu: z.string().optional().nullable(),
  bodyEn: z.string().optional().nullable(),
  bodyAr: z.string().optional().nullable(),
  bodyKu: z.string().optional().nullable(),
  primaryButtonTextEn: z.string().optional().nullable(),
  primaryButtonTextAr: z.string().optional().nullable(),
  primaryButtonTextKu: z.string().optional().nullable(),
  primaryButtonUrl: z.string().optional().nullable(),
  backgroundImage: z.string().min(1, "Background image is required"),
  overlayOpacity: z.number().min(0).max(100),
  sortOrder: z.number().min(0),
  status: z.enum(["active", "draft"]),
});

export type HeroSlideFormValues = z.infer<typeof heroSlideSchema>;

interface HeroSlideFormProps {
  initialValues?: HeroSlideEntity | null;
  onSubmit: (values: HeroSlideFormValues) => Promise<void>;
  isLoading?: boolean;
  isEditing?: boolean;
}

export function HeroSlideForm({
  initialValues,
  onSubmit,
  isLoading = false,
  isEditing = false,
}: HeroSlideFormProps) {
  const t = useTranslations("homepageAdmin");
  const tCommon = useTranslations("common");
  const router = useRouter();

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
      titleKu: "",
      subtitleEn: "",
      subtitleAr: "",
      subtitleKu: "",
      bodyEn: "",
      bodyAr: "",
      bodyKu: "",
      primaryButtonTextEn: "Explore Products",
      primaryButtonTextAr: "استكشف المنتجات",
      primaryButtonTextKu: "بەرهەمەکان ببینە",
      primaryButtonUrl: "/products",
      backgroundImage: "/hero-banner.jpg",
      overlayOpacity: 40,
      sortOrder: 0,
      status: "active",
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        titleEn: initialValues.titleEn ?? "",
        titleAr: initialValues.titleAr ?? "",
        titleKu: initialValues.titleKu ?? "",
        subtitleEn: initialValues.subtitleEn ?? "",
        subtitleAr: initialValues.subtitleAr ?? "",
        subtitleKu: initialValues.subtitleKu ?? "",
        bodyEn: initialValues.bodyEn ?? "",
        bodyAr: initialValues.bodyAr ?? "",
        bodyKu: initialValues.bodyKu ?? "",
        primaryButtonTextEn: initialValues.primaryButtonTextEn ?? "",
        primaryButtonTextAr: initialValues.primaryButtonTextAr ?? "",
        primaryButtonTextKu: initialValues.primaryButtonTextKu ?? "",
        primaryButtonUrl: initialValues.primaryButtonUrl ?? "/products",
        backgroundImage: initialValues.backgroundImage ?? "/hero-banner.jpg",
        overlayOpacity: initialValues.overlayOpacity ?? 40,
        sortOrder: initialValues.sortOrder ?? 0,
        status: initialValues.status ?? "active",
      });
    }
  }, [initialValues, reset]);

  const backgroundImage = watch("backgroundImage");
  const status = watch("status");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.push("/admin/homepage")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditing ? t("editHeroSlide") : t("addHeroSlide")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Update banner content, translations, and settings."
                : "Create a new homepage hero banner slide."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/homepage")}
          >
            {tCommon("cancel")}
          </Button>
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEditing ? tCommon("save") : tCommon("create")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-emerald-600" />
            <CardTitle>{t("bgImage")}</CardTitle>
          </div>
          <CardDescription>Upload a high-resolution hero background image.</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUploader
            label={t("bgImage")}
            value={backgroundImage}
            onChange={(url) => setValue("backgroundImage", url ?? "")}
            folder="hero"
          />
          {errors.backgroundImage && (
            <p className="text-xs text-destructive mt-1">{errors.backgroundImage.message}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Slide Content & Translations</CardTitle>
          <CardDescription>Configure localized banner titles, subtitles, descriptions, and CTA links.</CardDescription>
        </CardHeader>
        <CardContent>
          <MultilingualTabs
            englishFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="titleEn">{t("statTitleEn")} *</Label>
                  <Input id="titleEn" {...register("titleEn")} placeholder="e.g. High-Pressure Hydraulic Solutions" />
                  {errors.titleEn && <span className="text-xs text-destructive">{errors.titleEn.message}</span>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subtitleEn">{t("buttonTextEn")}</Label>
                  <Input id="subtitleEn" {...register("subtitleEn")} placeholder="e.g. Leading provider across Iraq" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bodyEn">Detailed Description (English)</Label>
                  <Textarea id="bodyEn" rows={3} {...register("bodyEn")} placeholder="Optional detailed paragraph..." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="primaryButtonTextEn">{t("primaryBtnEn")}</Label>
                    <Input id="primaryButtonTextEn" {...register("primaryButtonTextEn")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="primaryButtonUrl">{t("primaryBtnUrl")}</Label>
                    <Input id="primaryButtonUrl" {...register("primaryButtonUrl")} />
                  </div>
                </div>
              </div>
            }
            arabicFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="titleAr">{t("statTitleAr")} *</Label>
                  <Input id="titleAr" dir="rtl" {...register("titleAr")} placeholder="مثال: حلول الهيدروليك الصناعية" />
                  {errors.titleAr && <span className="text-xs text-destructive">{errors.titleAr.message}</span>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subtitleAr">{t("buttonTextAr")}</Label>
                  <Input id="subtitleAr" dir="rtl" {...register("subtitleAr")} placeholder="مثال: المزود الرائد في العراق" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bodyAr">الوصف التفصيلي (بالعربية)</Label>
                  <Textarea id="bodyAr" rows={3} dir="rtl" {...register("bodyAr")} placeholder="نص تفصيلي اختياري..." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="primaryButtonTextAr">نص الزر الرئيسي (بالعربية)</Label>
                    <Input id="primaryButtonTextAr" dir="rtl" {...register("primaryButtonTextAr")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="primaryButtonUrl">{t("primaryBtnUrl")}</Label>
                    <Input id="primaryButtonUrl" {...register("primaryButtonUrl")} />
                  </div>
                </div>
              </div>
            }
            kurdishFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="titleKu">{t("statTitleKu")}</Label>
                  <Input id="titleKu" dir="rtl" {...register("titleKu")} placeholder="دەق بگەڕێنەوە..." />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subtitleKu">{t("buttonTextKu")}</Label>
                  <Input id="subtitleKu" dir="rtl" {...register("subtitleKu")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bodyKu">وێناکردن (کوردی)</Label>
                  <Textarea id="bodyKu" rows={3} dir="rtl" {...register("bodyKu")} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="primaryButtonTextKu">دەقی دوگمە (کوردی)</Label>
                    <Input id="primaryButtonTextKu" dir="rtl" {...register("primaryButtonTextKu")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="primaryButtonUrl">{t("primaryBtnUrl")}</Label>
                    <Input id="primaryButtonUrl" {...register("primaryButtonUrl")} />
                  </div>
                </div>
              </div>
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Slide Settings</CardTitle>
          <CardDescription>Control visibility, dark overlay darkness, and display order.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>{t("status")}</Label>
            <Select value={status} onValueChange={(val: "active" | "draft") => setValue("status", val)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="overlayOpacity">{t("overlayOpacity")}</Label>
            <Input
              id="overlayOpacity"
              type="number"
              min={0}
              max={100}
              {...register("overlayOpacity", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sortOrder">{t("sortOrder")}</Label>
            <Input
              id="sortOrder"
              type="number"
              min={0}
              {...register("sortOrder", { valueAsNumber: true })}
            />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
