"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@shared/ui";
import { MultilingualTabs } from "@shared/components/multilingual-tabs";
import { ImageUploader } from "@shared/upload/image-uploader";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "@shared/hooks/projects/use-projects-hooks";
import { useCategories } from "@shared/hooks/categories/use-category-hooks";
import type { ProjectEntity, ProjectStatus } from "../../domain/entities/project.entity";
import { Loader2, ArrowLeft, Save, Plus, X, ImageIcon, FolderKanban } from "lucide-react";
import { toast } from "sonner";

const projectSchema = z.object({
  slugEn: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  slugAr: z.string().optional().nullable(),
  slugKu: z.string().optional().nullable(),
  titleEn: z.string().min(2, "English title is required"),
  titleAr: z.string().optional().nullable(),
  titleKu: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  descriptionKu: z.string().optional().nullable(),
  challengeEn: z.string().optional().nullable(),
  challengeAr: z.string().optional().nullable(),
  challengeKu: z.string().optional().nullable(),
  solutionEn: z.string().optional().nullable(),
  solutionAr: z.string().optional().nullable(),
  solutionKu: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  clientName: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  completionDate: z.string().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]),
  isFeatured: z.boolean(),
  featuredOrder: z.number().int().min(0),
  sortOrder: z.number().int().min(0),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: ProjectEntity | null;
  isEdit?: boolean;
}

export function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("projects");
  const tCommon = useTranslations("common");

  const [galleryImages, setGalleryImages] = useState<string[]>(initialData?.images ?? []);

  const { data: categoriesData } = useCategories({ limit: 100 });
  const categories = categoriesData?.items ?? [];

  const createMutation = useCreateProjectMutation();
  const updateMutation = useUpdateProjectMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      slugEn: initialData?.slugEn ?? "",
      slugAr: initialData?.slugAr ?? "",
      slugKu: initialData?.slugKu ?? "",
      titleEn: initialData?.titleEn ?? "",
      titleAr: initialData?.titleAr ?? "",
      titleKu: initialData?.titleKu ?? "",
      descriptionEn: initialData?.descriptionEn ?? "",
      descriptionAr: initialData?.descriptionAr ?? "",
      descriptionKu: initialData?.descriptionKu ?? "",
      challengeEn: initialData?.challengeEn ?? "",
      challengeAr: initialData?.challengeAr ?? "",
      challengeKu: initialData?.challengeKu ?? "",
      solutionEn: initialData?.solutionEn ?? "",
      solutionAr: initialData?.solutionAr ?? "",
      solutionKu: initialData?.solutionKu ?? "",
      categoryId: initialData?.categoryId ?? undefined,
      clientName: initialData?.clientName ?? "",
      location: initialData?.location ?? "",
      completionDate: initialData?.completionDate ?? "",
      status: initialData?.status ?? "published",
      isFeatured: initialData?.isFeatured ?? false,
      featuredOrder: initialData?.featuredOrder ?? 0,
      sortOrder: initialData?.sortOrder ?? 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        slugEn: initialData.slugEn ?? "",
        slugAr: initialData.slugAr ?? "",
        slugKu: initialData.slugKu ?? "",
        titleEn: initialData.titleEn ?? "",
        titleAr: initialData.titleAr ?? "",
        titleKu: initialData.titleKu ?? "",
        descriptionEn: initialData.descriptionEn ?? "",
        descriptionAr: initialData.descriptionAr ?? "",
        descriptionKu: initialData.descriptionKu ?? "",
        challengeEn: initialData.challengeEn ?? "",
        challengeAr: initialData.challengeAr ?? "",
        challengeKu: initialData.challengeKu ?? "",
        solutionEn: initialData.solutionEn ?? "",
        solutionAr: initialData.solutionAr ?? "",
        solutionKu: initialData.solutionKu ?? "",
        categoryId: initialData.categoryId ?? undefined,
        clientName: initialData.clientName ?? "",
        location: initialData.location ?? "",
        completionDate: initialData.completionDate ?? "",
        status: initialData.status ?? "published",
        isFeatured: initialData.isFeatured ?? false,
        featuredOrder: initialData.featuredOrder ?? 0,
        sortOrder: initialData.sortOrder ?? 0,
      });
      setGalleryImages(initialData.images ?? []);
    }
  }, [initialData, reset]);

  const handleTitleEnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("titleEn", val);
    if (!isEdit) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setValue("slugEn", generatedSlug);
    }
  };

  const handleAddImage = (url: string | null) => {
    if (url) {
      setGalleryImages((prev) => [...prev, url]);
      toast.success("Image added to gallery");
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      const payload = {
        ...values,
        images: galleryImages,
      };

      if (isEdit && initialData) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          ...payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      router.push(`/${locale}/admin/projects`);
    } catch {
      // Errors handled by mutation toasts
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.push(`/${locale}/admin/projects`)}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {isEdit ? `${t("editTitle")}: ${initialData?.titleEn}` : t("createTitle")}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isEdit ? t("editDesc") : t("createDesc")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push(`/${locale}/admin/projects`)}
            disabled={isSubmitting}
            className="text-xs"
          >
            {tCommon("cancel")}
          </Button>
          <Button type="submit" size="sm" disabled={isSubmitting} className="text-xs gap-1.5 min-w-[130px]">
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> {tCommon("saving")}
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" /> {isEdit ? tCommon("saveChanges") : t("createTitle")}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Multilingual Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border shadow-xs">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-primary" />
                {t("form.multilingualContent")}
              </CardTitle>
              <CardDescription className="text-xs">
                {t("form.multilingualDesc")}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <MultilingualTabs
                englishFields={
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold" htmlFor="titleEn">{t("form.titleEn")} *</Label>
                      <Input
                        id="titleEn"
                        placeholder="e.g. Al Assi Refinery Pipeline Expansion"
                        value={watch("titleEn")}
                        onChange={handleTitleEnChange}
                        className="text-xs h-9"
                      />
                      {errors.titleEn && <p className="text-[11px] font-semibold text-destructive">{errors.titleEn.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold" htmlFor="slugEn">{t("form.urlSlug")} (English) *</Label>
                      <Input
                        id="slugEn"
                        placeholder="al-assi-pipeline-expansion"
                        {...register("slugEn")}
                        className="text-xs h-9 font-mono"
                      />
                      {errors.slugEn && <p className="text-[11px] font-semibold text-destructive">{errors.slugEn.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold" htmlFor="descriptionEn">{t("form.fullEn")}</Label>
                      <Textarea
                        id="descriptionEn"
                        rows={5}
                        placeholder="Detailed overview of the project engineering, design, and execution..."
                        {...register("descriptionEn")}
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold" htmlFor="challengeEn">Project Challenge (English)</Label>
                      <Textarea
                        id="challengeEn"
                        rows={3}
                        placeholder="Key technical, environmental, or logistical challenges faced..."
                        {...register("challengeEn")}
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold" htmlFor="solutionEn">Project Solution & Results (English)</Label>
                      <Textarea
                        id="solutionEn"
                        rows={3}
                        placeholder="Innovative engineering solutions and performance outcomes delivered..."
                        {...register("solutionEn")}
                        className="text-xs"
                      />
                    </div>
                  </div>
                }
                arabicFields={
                  <div className="space-y-4" dir="rtl">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold" htmlFor="titleAr">{t("form.titleAr")}</Label>
                      <Input
                        id="titleAr"
                        placeholder="مثال: مشروع توسعة خطوط أنابيب العاصي"
                        {...register("titleAr")}
                        className="text-xs h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold" htmlFor="slugAr">{t("form.urlSlug")} (بالعربية)</Label>
                      <Input
                        id="slugAr"
                        placeholder="توسعة-خطوط-أنابيب-العاصي"
                        {...register("slugAr")}
                        className="text-xs h-9 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold" htmlFor="descriptionAr">{t("form.fullAr")}</Label>
                      <Textarea
                        id="descriptionAr"
                        rows={5}
                        placeholder="تفاصيل المشروع الهندسية والتنفيذية الكاملة..."
                        {...register("descriptionAr")}
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold" htmlFor="challengeAr">تحديات المشروع (بالعربية)</Label>
                      <Textarea
                        id="challengeAr"
                        rows={3}
                        placeholder="التحديات الفنية أو البيئية التي تم التعامل معها..."
                        {...register("challengeAr")}
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold" htmlFor="solutionAr">الحلول والنتائج (بالعربية)</Label>
                      <Textarea
                        id="solutionAr"
                        rows={3}
                        placeholder="الحلول الهندسية المبتكرة والنتائج المحققة..."
                        {...register("solutionAr")}
                        className="text-xs"
                      />
                    </div>
                  </div>
                }
                kurdishFields={
                  <div className="space-y-4" dir="rtl">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold" htmlFor="titleKu">{t("form.titleKu")}</Label>
                      <Input
                        id="titleKu"
                        placeholder="نموونە: پڕۆژەی فراوانکردنی هێڵی بۆری العاصي"
                        {...register("titleKu")}
                        className="text-xs h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold" htmlFor="slugKu">{t("form.urlSlug")} (بە کوردی)</Label>
                      <Input
                        id="slugKu"
                        placeholder="فراوانکردنی-هێڵی-بۆری"
                        {...register("slugKu")}
                        className="text-xs h-9 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold" htmlFor="descriptionKu">{t("form.fullKu")}</Label>
                      <Textarea
                        id="descriptionKu"
                        rows={5}
                        placeholder="وردەکارییە تەواوەکانی پڕۆژەکە..."
                        {...register("descriptionKu")}
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold" htmlFor="challengeKu">ئاستەنگەکانی پڕۆژە (بە کوردی)</Label>
                      <Textarea
                        id="challengeKu"
                        rows={3}
                        placeholder="ئەو ئاستەنگانەی هاتنە پێش لە کاتی جێبەجێکردندا..."
                        {...register("challengeKu")}
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold" htmlFor="solutionKu">شیکار و ئەنجامەکان (بە کوردی)</Label>
                      <Textarea
                        id="solutionKu"
                        rows={3}
                        placeholder="چارەسەرە ئەندازیارییەکان و ئەنجامە دەستکەوتووەکان..."
                        {...register("solutionKu")}
                        className="text-xs"
                      />
                    </div>
                  </div>
                }
              />
            </CardContent>
          </Card>

          {/* Gallery Images Card */}
          <Card className="border shadow-xs">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                Project Gallery ({galleryImages.length} images)
              </CardTitle>
              <CardDescription className="text-xs">
                Upload project photography. The first image will be used as the featured cover photo.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <ImageUploader
                label="Add Image to Gallery"
                value=""
                onChange={handleAddImage}
                bucket="project-images"
                folder="projects"
              />

              {galleryImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {galleryImages.map((imgUrl, idx) => (
                    <div key={idx} className="relative group h-28 rounded-lg overflow-hidden border bg-muted shadow-xs">
                      <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                        title="Remove photo"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Settings & Metadata */}
        <div className="space-y-6">
          <Card className="border shadow-xs">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold">{t("form.projectInfo")}</CardTitle>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* Category */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("form.category")}</Label>
                <Select
                  value={watch("categoryId") || "none"}
                  onValueChange={(val) => setValue("categoryId", val === "none" ? undefined : val)}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder={t("form.category")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-xs">{t("form.noCategory")}</SelectItem>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id} className="text-xs">
                        {cat.getLocalizedName ? cat.getLocalizedName(locale) : cat.nameEn || cat.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status (draft | published | archived) */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("form.projectStatus")} *</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(val) => setValue("status", val as ProjectStatus)}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder={t("form.projectStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published" className="text-xs">Published</SelectItem>
                    <SelectItem value="draft" className="text-xs">Draft</SelectItem>
                    <SelectItem value="archived" className="text-xs">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Client Name */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("form.clientName")}</Label>
                <Input
                  placeholder="e.g. Ministry of Oil & Energy"
                  {...register("clientName")}
                  className="text-xs h-9"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("form.projectLocation")}</Label>
                <Input
                  placeholder="e.g. Erbil / Basra, Iraq"
                  {...register("location")}
                  className="text-xs h-9"
                />
              </div>

              {/* Completion Date */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("form.completionDate")}</Label>
                <Input
                  type="date"
                  {...register("completionDate")}
                  className="text-xs h-9"
                />
              </div>

              {/* Display Order */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("form.displayOrder")}</Label>
                <Input
                  type="number"
                  min={0}
                  {...register("sortOrder", { valueAsNumber: true })}
                  className="text-xs h-9 font-mono"
                />
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 pt-2">
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold cursor-pointer">{t("form.featuredProject")}</Label>
                  <p className="text-[11px] text-muted-foreground">{t("form.featuredDesc")}</p>
                </div>
                <Switch
                  checked={watch("isFeatured")}
                  onCheckedChange={(val) => setValue("isFeatured", val)}
                />
              </div>

              {/* Featured Order */}
              {watch("isFeatured") && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Featured Order</Label>
                  <Input
                    type="number"
                    min={0}
                    {...register("featuredOrder", { valueAsNumber: true })}
                    className="text-xs h-9 font-mono"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
