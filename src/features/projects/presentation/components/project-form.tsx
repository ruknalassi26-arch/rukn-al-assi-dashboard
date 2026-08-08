"use client";
// ==============================================================================
// features/projects/presentation/components/project-form.tsx
// Trilingual Form Component for Creating & Editing Projects with Supabase Storage
// ==============================================================================
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@core/lib/supabase/client";
import { getStoragePublicUrl } from "@core/utils/storage";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@shared/ui";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "@shared/hooks/projects/use-projects-hooks";
import { useCategories } from "@shared/hooks/categories/use-category-hooks";
import type { ProjectEntity, ProjectStatus } from "../../domain/entities/project.entity";
import { Upload, X, Loader2, ArrowLeft, Image as ImageIcon, Plus } from "lucide-react";
import { toast } from "sonner";

const projectSchema = z.object({
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  titleEn: z.string().min(2, "English title is required"),
  titleAr: z.string().min(2, "Arabic title is required"),
  titleKu: z.string().optional(),
  shortDescriptionEn: z.string().optional(),
  shortDescriptionAr: z.string().optional(),
  shortDescriptionKu: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  descriptionKu: z.string().optional(),
  categoryId: z.string().optional(),
  client: z.string().optional(),
  location: z.string().optional(),
  completionDate: z.string().optional(),
  year: z.number().optional(),
  status: z.enum(["active", "draft", "completed", "ongoing", "upcoming"]),
  isFeatured: z.boolean(),
  sortOrder: z.number().int().min(0),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: ProjectEntity | null;
  isEdit?: boolean;
}

export function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("projects");
  const tCommon = useTranslations("common");

  const [activeTab, setActiveTab] = useState<"en" | "ar" | "ckb">("en");
  const [coverImage, setCoverImage] = useState<string | null>(initialData?.coverImage ?? null);
  const [galleryImages, setGalleryImages] = useState<string[]>(initialData?.images ?? []);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const { data: categoriesData } = useCategories({ limit: 100 });
  const categories = categoriesData?.items ?? [];

  const createMutation = useCreateProjectMutation();
  const updateMutation = useUpdateProjectMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      slug: initialData?.slug ?? "",
      titleEn: initialData?.titleEn ?? "",
      titleAr: initialData?.titleAr ?? "",
      titleKu: initialData?.titleKu ?? "",
      shortDescriptionEn: initialData?.shortDescriptionEn ?? "",
      shortDescriptionAr: initialData?.shortDescriptionAr ?? "",
      shortDescriptionKu: initialData?.shortDescriptionKu ?? "",
      descriptionEn: initialData?.descriptionEn ?? "",
      descriptionAr: initialData?.descriptionAr ?? "",
      descriptionKu: initialData?.descriptionKu ?? "",
      categoryId: initialData?.categoryId ?? undefined,
      client: initialData?.client ?? "",
      location: initialData?.location ?? "",
      completionDate: initialData?.completionDate ?? "",
      year: initialData?.year ?? new Date().getFullYear(),
      status: initialData?.status ?? "active",
      isFeatured: initialData?.isFeatured ?? false,
      sortOrder: initialData?.sortOrder ?? 0,
    },
  });

  const titleEnValue = watch("titleEn");

  // Auto-generate slug from English title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("titleEn", val);
    if (!isEdit) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setValue("slug", generatedSlug);
    }
  };

  const uploadToStorage = async (file: File): Promise<string> => {
    const supabase = createClient();
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const path = `${timestamp}-${sanitizedName}`;

    let bucket = "project-images";
    let { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });

    if (error) {
      bucket = "product-images";
      const res = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (res.error) throw new Error(res.error.message);
    }

    return getStoragePublicUrl(bucket, path);
  };

  // Upload Single Cover Image to Supabase Storage
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB");
      return;
    }

    setIsUploadingCover(true);
    try {
      const url = await uploadToStorage(file);
      setCoverImage(url);
      toast.success("Cover image uploaded successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload cover image");
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Upload Gallery Images (Multiple)
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadToStorage(file));
      const urls = await Promise.all(uploadPromises);
      setGalleryImages((prev) => [...prev, ...urls]);
      toast.success(`${urls.length} gallery image(s) uploaded successfully`);
    } catch (err: any) {
      toast.error(err.message || "Failed to upload gallery images");
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const onSubmit: SubmitHandler<ProjectFormValues> = async (values) => {
    const payload = {
      ...values,
      coverImage,
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
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
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
              {isEdit ? t("editTitle") : t("createTitle")}
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
          <Button type="submit" size="sm" disabled={isSubmitting} className="text-xs gap-1.5">
            {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{isEdit ? t("editTitle") : t("createTitle")}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Multilingual Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trilingual Tabs */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">{t("form.multilingualContent")}</CardTitle>
                <Tabs value={activeTab} onValueChange={(val: string) => setActiveTab(val as "en" | "ar" | "ckb")} className="w-auto">
                  <TabsList className="h-8">
                    <TabsTrigger value="en" className="text-xs px-3">English 🇺🇸</TabsTrigger>
                    <TabsTrigger value="ar" className="text-xs px-3">العربية 🇮🇶</TabsTrigger>
                    <TabsTrigger value="ckb" className="text-xs px-3">کوردی ☀️</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription className="text-xs">
                {t("form.multilingualDesc")}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* Tab 1: English */}
              {activeTab === "en" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t("form.titleEn")} *</Label>
                    <Input
                      placeholder="e.g. Al Assi Refinery Pipeline Expansion"
                      value={titleEnValue}
                      onChange={handleTitleChange}
                      className="text-xs h-9"
                    />
                    {errors.titleEn && <p className="text-[11px] text-destructive">{errors.titleEn.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t("form.shortEn")}</Label>
                    <Input
                      placeholder="Brief overview of the project scope and key results"
                      {...register("shortDescriptionEn")}
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t("form.fullEn")}</Label>
                    <Textarea
                      rows={6}
                      placeholder="Comprehensive project details, specifications, and client achievements..."
                      {...register("descriptionEn")}
                      className="text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Arabic */}
              {activeTab === "ar" && (
                <div className="space-y-4" dir="rtl">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t("form.titleAr")} *</Label>
                    <Input
                      placeholder="مثال: مشروع توسعة خطوط أنابيب العاصي"
                      {...register("titleAr")}
                      className="text-xs h-9"
                    />
                    {errors.titleAr && <p className="text-[11px] text-destructive">{errors.titleAr.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t("form.shortAr")}</Label>
                    <Input
                      placeholder="ملخص موجز لنطاق العمل والنتائج"
                      {...register("shortDescriptionAr")}
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t("form.fullAr")}</Label>
                    <Textarea
                      rows={6}
                      placeholder="تفاصيل المشروع الكاملة والمواصفات الفنية..."
                      {...register("descriptionAr")}
                      className="text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Kurdish Sorani */}
              {activeTab === "ckb" && (
                <div className="space-y-4" dir="rtl">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t("form.titleKu")}</Label>
                    <Input
                      placeholder="نموونە: پڕۆژەی فراوانکردنی هێڵی بۆری العاصي"
                      {...register("titleKu")}
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t("form.shortKu")}</Label>
                    <Input
                      placeholder="پوختەیەک دەربارەی پڕۆژەکە"
                      {...register("shortDescriptionKu")}
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">{t("form.fullKu")}</Label>
                    <Textarea
                      rows={6}
                      placeholder="وردەکارییە تەواوەکانی پڕۆژەکە..."
                      {...register("descriptionKu")}
                      className="text-xs"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Media Images Card */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                {t("form.mediaCardTitle")}
              </CardTitle>
              <CardDescription className="text-xs">
                {t("form.mediaCardDesc")}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-6">
              {/* Cover Image Upload */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">{t("form.coverLabel")}</Label>
                {coverImage ? (
                  <div className="relative group w-full h-48 rounded-xl overflow-hidden border bg-muted">
                    <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Label htmlFor="cover-input" className="cursor-pointer">
                        <span className="bg-white text-black px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 shadow-sm">
                          <Upload className="h-3.5 w-3.5" /> Replace
                        </span>
                      </Label>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setCoverImage(null)}
                        className="text-xs h-8 px-3"
                      >
                        <X className="h-3.5 w-3.5 me-1" /> {tCommon("delete")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Label
                    htmlFor="cover-input"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors p-4"
                  >
                    {isUploadingCover ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground">{tCommon("loading")}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground/60" />
                        <span className="text-xs font-semibold text-foreground">{t("form.coverLabel")}</span>
                        <span className="text-[11px] text-muted-foreground">{t("form.coverHint")}</span>
                      </div>
                    )}
                  </Label>
                )}
                <input
                  id="cover-input"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={isUploadingCover}
                  className="hidden"
                />
              </div>

              {/* Gallery Images (Multiple) */}
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">{t("form.galleryLabel")}</Label>
                  <span className="text-[11px] text-muted-foreground">{galleryImages.length} uploaded</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {galleryImages.map((imgUrl, idx) => (
                    <div key={idx} className="relative group h-24 rounded-lg overflow-hidden border bg-muted">
                      <img src={imgUrl} alt={`Gallery item ${idx}`} className="w-full h-full object-cover" />
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

                  <Label
                    htmlFor="gallery-input"
                    className="flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    {isUploadingGallery ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Plus className="h-5 w-5 text-muted-foreground" />
                        <span className="text-[10px] font-semibold text-muted-foreground">{t("form.galleryHint")}</span>
                      </div>
                    )}
                  </Label>
                </div>
                <input
                  id="gallery-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  disabled={isUploadingGallery}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Settings, Category, Status & Metadata */}
        <div className="space-y-6">
          <Card className="border shadow-sm">
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
                        {cat.getLocalizedName ? cat.getLocalizedName(locale) : cat.nameEn || cat.name_en || cat.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
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
                    <SelectItem value="active" className="text-xs">{tCommon("active")}</SelectItem>
                    <SelectItem value="completed" className="text-xs">{tCommon("completed")}</SelectItem>
                    <SelectItem value="ongoing" className="text-xs">{tCommon("ongoing")}</SelectItem>
                    <SelectItem value="upcoming" className="text-xs">{tCommon("upcoming")}</SelectItem>
                    <SelectItem value="draft" className="text-xs">{tCommon("draft")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Client Name */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("form.clientName")}</Label>
                <Input
                  placeholder="e.g. Ministry of Oil & Energy"
                  {...register("client")}
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

              {/* Slug */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("form.urlSlug")} *</Label>
                <Input
                  placeholder="al-assi-pipeline-expansion"
                  {...register("slug")}
                  className="text-xs h-9 font-mono"
                />
                {errors.slug && <p className="text-[11px] text-destructive">{errors.slug.message}</p>}
              </div>

              {/* Display Order */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">{t("form.displayOrder")}</Label>
                <Input
                  type="number"
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
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
