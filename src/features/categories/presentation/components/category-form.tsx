"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Loader2, Save, ArrowLeft, Sparkles, FolderKanban } from "lucide-react";
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
  Switch,
} from "@shared/ui";
import { MultilingualTabs } from "@shared/components/multilingual-tabs";
import { ImageUploader } from "@shared/upload/image-uploader";
import { useCreateCategory, useUpdateCategory } from "@shared/hooks/categories/use-category-hooks";
import type { CategoryEntity } from "../../domain/entities/category.entity";

const categorySchema = z.object({
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and hyphens"),
  nameEn: z.string().min(2, "English name is required"),
  nameAr: z.string().min(2, "Arabic name is required"),
  nameKu: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  descriptionKu: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  seoTitleEn: z.string().optional().nullable(),
  seoTitleAr: z.string().optional().nullable(),
  seoTitleKu: z.string().optional().nullable(),
  seoDescriptionEn: z.string().optional().nullable(),
  seoDescriptionAr: z.string().optional().nullable(),
  seoDescriptionKu: z.string().optional().nullable(),
  status: z.enum(["active", "draft"]),
  sortOrder: z.number().min(0),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: CategoryEntity | null;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const tForm = useTranslations("categoryForm");
  const tCommon = useTranslations("common");
  const isEditing = !!initialData;

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const isSubmitting = createCategoryMutation.isPending || updateCategoryMutation.isPending;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      slug: initialData?.slug ?? "",
      nameEn: initialData?.nameEn ?? "",
      nameAr: initialData?.nameAr ?? "",
      nameKu: initialData?.nameKu ?? "",
      descriptionEn: initialData?.descriptionEn ?? "",
      descriptionAr: initialData?.descriptionAr ?? "",
      descriptionKu: initialData?.descriptionKu ?? "",
      icon: initialData?.icon ?? "",
      image: initialData?.image ?? "",
      seoTitleEn: initialData?.seoTitleEn ?? "",
      seoTitleAr: initialData?.seoTitleAr ?? "",
      seoTitleKu: initialData?.seoTitleKu ?? "",
      seoDescriptionEn: initialData?.seoDescriptionEn ?? "",
      seoDescriptionAr: initialData?.seoDescriptionAr ?? "",
      seoDescriptionKu: initialData?.seoDescriptionKu ?? "",
      status: initialData?.status ?? "active",
      sortOrder: initialData?.sortOrder ?? 0,
    },
  });

  const { watch, setValue, register, handleSubmit, formState: { errors } } = form;
  const nameEn = watch("nameEn");
  const slug = watch("slug");

  // Auto slug generator from English Name if not manually overridden
  useEffect(() => {
    if (!isEditing && nameEn && !slug) {
      const generatedSlug = nameEn
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [nameEn, slug, isEditing, setValue]);

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      if (isEditing && initialData) {
        await updateCategoryMutation.mutateAsync({
          id: initialData.id,
          ...values,
        });
      } else {
        await createCategoryMutation.mutateAsync(values);
      }
      router.push("/admin/categories");
    } catch {
      // Toast notification is handled in mutation hooks
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.push("/admin/categories")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditing ? `${tForm("editTitle")}: ${initialData.nameEn}` : tForm("createTitle")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEditing ? tForm("editSubtitle") : tForm("createSubtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/categories")}
            disabled={isSubmitting}
          >
            {tForm("cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2 min-w-[140px]">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {tForm("saving")}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> {isEditing ? tForm("updateBtn") : tForm("saveBtn")}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-primary" />
                {tForm("contentTitle")}
              </CardTitle>
              <CardDescription>
                {tForm("contentSubtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MultilingualTabs
                englishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameEn">{tForm("nameEn")} *</Label>
                      <Input
                        id="nameEn"
                        {...register("nameEn")}
                      />
                      {errors.nameEn && (
                        <p className="text-xs font-semibold text-destructive">{errors.nameEn.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionEn">{tForm("descEn")}</Label>
                      <Textarea
                        id="descriptionEn"
                        className="min-h-[120px]"
                        {...register("descriptionEn")}
                      />
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">SEO Meta (English)</h4>
                      <div className="space-y-2">
                        <Label htmlFor="seoTitleEn">Meta Title (English)</Label>
                        <Input id="seoTitleEn" {...register("seoTitleEn")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seoDescriptionEn">Meta Description (English)</Label>
                        <Textarea id="seoDescriptionEn" className="min-h-[70px]" {...register("seoDescriptionEn")} />
                      </div>
                    </div>
                  </div>
                }
                arabicFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameAr">{tForm("nameAr")} *</Label>
                      <Input
                        id="nameAr"
                        dir="rtl"
                        {...register("nameAr")}
                      />
                      {errors.nameAr && (
                        <p className="text-xs font-semibold text-destructive">{errors.nameAr.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionAr">{tForm("descAr")}</Label>
                      <Textarea
                        id="descriptionAr"
                        dir="rtl"
                        className="min-h-[120px]"
                        {...register("descriptionAr")}
                      />
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">تهيئة محركات البحث SEO (بالعربية)</h4>
                      <div className="space-y-2">
                        <Label htmlFor="seoTitleAr">عنوان SEO (بالعربية)</Label>
                        <Input id="seoTitleAr" dir="rtl" {...register("seoTitleAr")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seoDescriptionAr">وصف SEO (بالعربية)</Label>
                        <Textarea id="seoDescriptionAr" dir="rtl" className="min-h-[70px]" {...register("seoDescriptionAr")} />
                      </div>
                    </div>
                  </div>
                }
                kurdishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameKu">{tForm("nameKu")}</Label>
                      <Input
                        id="nameKu"
                        dir="rtl"
                        {...register("nameKu")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionKu">{tForm("descKu")}</Label>
                      <Textarea
                        id="descriptionKu"
                        dir="rtl"
                        className="min-h-[120px]"
                        {...register("descriptionKu")}
                      />
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">ڕێکخستنەکانی SEO (بە کوردی)</h4>
                      <div className="space-y-2">
                        <Label htmlFor="seoTitleKu">نیشانی SEO (بە کوردی)</Label>
                        <Input id="seoTitleKu" dir="rtl" {...register("seoTitleKu")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seoDescriptionKu">وەسفی SEO (بە کوردی)</Label>
                        <Textarea id="seoDescriptionKu" dir="rtl" className="min-h-[70px]" {...register("seoDescriptionKu")} />
                      </div>
                    </div>
                  </div>
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Status & Display Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{tForm("settingsTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug">{tForm("slug")} *</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px] gap-1 px-1.5"
                    onClick={() => {
                      if (nameEn) {
                        const generatedSlug = nameEn
                          .toLowerCase()
                          .trim()
                          .replace(/[^a-z0-9\s-]/g, "")
                          .replace(/\s+/g, "-");
                        setValue("slug", generatedSlug, { shouldValidate: true });
                      }
                    }}
                  >
                    <Sparkles className="h-3 w-3" /> {tForm("autoSlug")}
                  </Button>
                </div>
                <Input id="slug" {...register("slug")} />
                {errors.slug && (
                  <p className="text-xs font-semibold text-destructive">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">{tForm("status")}</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(val) => setValue("status", val as "active" | "draft")}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{tCommon("active")}</SelectItem>
                    <SelectItem value="draft">{tCommon("draft")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder">{tForm("sortOrder")}</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min={0}
                  {...register("sortOrder", { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">{tForm("icon")}</Label>
                <Input id="icon" {...register("icon")} />
              </div>
            </CardContent>
          </Card>

          {/* Category Image Card */}
          <Card>
            <CardHeader>
              <CardTitle>{tForm("imageTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                value={watch("image") ?? ""}
                onChange={(url) => setValue("image", url)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
