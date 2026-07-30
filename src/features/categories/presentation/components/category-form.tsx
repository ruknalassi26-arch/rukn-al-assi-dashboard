"use client";
// ==============================================================================
// features/categories/presentation/components/category-form.tsx
// Category Creation / Editing Form with RHF + Zod + MultilingualTabs
// ==============================================================================
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
              {isEditing ? `Edit Category: ${initialData.nameEn}` : "Create New Category"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure multilingual category attributes, images, and display parameters.
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
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2 min-w-[140px]">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> {isEditing ? "Update Category" : "Save Category"}
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
                Category Content
              </CardTitle>
              <CardDescription>
                Provide translatable names and descriptions using the language tabs below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MultilingualTabs
                englishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameEn">Category Name (English) *</Label>
                      <Input
                        id="nameEn"
                        placeholder="e.g. Hydraulic Pumps"
                        {...register("nameEn")}
                      />
                      {errors.nameEn && (
                        <p className="text-xs font-semibold text-destructive">{errors.nameEn.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionEn">Description (English)</Label>
                      <Textarea
                        id="descriptionEn"
                        placeholder="Provide a detailed description of this category..."
                        className="min-h-[120px]"
                        {...register("descriptionEn")}
                      />
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">SEO Meta Settings (English)</h4>
                      <div className="space-y-2">
                        <Label htmlFor="seoTitleEn">Meta Title (English)</Label>
                        <Input id="seoTitleEn" placeholder="SEO Title for search engines" {...register("seoTitleEn")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seoDescriptionEn">Meta Description (English)</Label>
                        <Textarea id="seoDescriptionEn" placeholder="SEO Description summary" className="min-h-[70px]" {...register("seoDescriptionEn")} />
                      </div>
                    </div>
                  </div>
                }
                arabicFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameAr">اسم الفئة (بالعربية) *</Label>
                      <Input
                        id="nameAr"
                        placeholder="مثال: المضخات الهيدروليكية"
                        {...register("nameAr")}
                      />
                      {errors.nameAr && (
                        <p className="text-xs font-semibold text-destructive">{errors.nameAr.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionAr">الوصف (بالعربية)</Label>
                      <Textarea
                        id="descriptionAr"
                        placeholder="أدخل وصفاً تفصيلياً لهذه الفئة..."
                        className="min-h-[120px]"
                        {...register("descriptionAr")}
                      />
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">إعدادات SEO (بالعربية)</h4>
                      <div className="space-y-2">
                        <Label htmlFor="seoTitleAr">عنوان SEO (بالعربية)</Label>
                        <Input id="seoTitleAr" placeholder="عنوان الصفحات في محركات البحث" {...register("seoTitleAr")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seoDescriptionAr">وصف SEO (بالعربية)</Label>
                        <Textarea id="seoDescriptionAr" placeholder="ملخص المحتوى لمحركات البحث" className="min-h-[70px]" {...register("seoDescriptionAr")} />
                      </div>
                    </div>
                  </div>
                }
                kurdishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameKu">ناوی هاوپۆل (بە کوردی)</Label>
                      <Input
                        id="nameKu"
                        placeholder="نموونە: پەمپە هایدرۆلیکییەکان"
                        {...register("nameKu")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionKu">وەسفی هاوپۆل (بە کوردی)</Label>
                      <Textarea
                        id="descriptionKu"
                        placeholder="زانیاری و ووردەکاری دەربارەی ئەم هاوپۆلە..."
                        className="min-h-[120px]"
                        {...register("descriptionKu")}
                      />
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">ڕێکخستنەکانی SEO (بە کوردی)</h4>
                      <div className="space-y-2">
                        <Label htmlFor="seoTitleKu">نیشانی SEO (بە کوردی)</Label>
                        <Input id="seoTitleKu" placeholder="نیشانی پەڕە بۆ بزوێنەرەکانی گەڕان" {...register("seoTitleKu")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seoDescriptionKu">وەسفی SEO (بە کوردی)</Label>
                        <Textarea id="seoDescriptionKu" placeholder="پوختەی ناوەڕۆک بۆ بزوێنەرەکانی گەڕان" className="min-h-[70px]" {...register("seoDescriptionKu")} />
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
              <CardTitle>Settings & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug">URL Slug *</Label>
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
                    <Sparkles className="h-3 w-3" /> Auto Slug
                  </Button>
                </div>
                <Input id="slug" placeholder="e.g. hydraulic-pumps" {...register("slug")} />
                {errors.slug && (
                  <p className="text-xs font-semibold text-destructive">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Publishing Status</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(val) => setValue("status", val as "active" | "draft")}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active (Visible)</SelectItem>
                    <SelectItem value="draft">Draft (Hidden)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder">Display Order (Sort Order)</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min={0}
                  {...register("sortOrder", { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Lucide Icon Identifier (Optional)</Label>
                <Input id="icon" placeholder="e.g. Wrench, Shield, Zap" {...register("icon")} />
              </div>
            </CardContent>
          </Card>

          {/* Category Image Card */}
          <Card>
            <CardHeader>
              <CardTitle>Category Image</CardTitle>
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
