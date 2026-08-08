"use client";
// ==============================================================================
// features/products/presentation/components/product-form.tsx
// Complete Form for Creating / Editing Products with Bilingual Tabs & Storage Uploads
// ==============================================================================
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Loader2, Save, ArrowLeft, Plus, Trash2, FileText, Sparkles } from "lucide-react";
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
import { useProductCategories, useCreateProduct, useUpdateProduct } from "@shared/hooks/products/use-product-hooks";
import type { ProductEntity } from "../../domain/entities/product.entity";

const productSchema = z.object({
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and hyphens"),
  nameEn: z.string().min(2, "English name is required"),
  nameAr: z.string().min(2, "Arabic name is required"),
  nameKu: z.string().optional().nullable(),
  shortDescriptionEn: z.string().optional().nullable(),
  shortDescriptionAr: z.string().optional().nullable(),
  shortDescriptionKu: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  descriptionKu: z.string().optional().nullable(),
  seoTitleEn: z.string().optional().nullable(),
  seoTitleAr: z.string().optional().nullable(),
  seoTitleKu: z.string().optional().nullable(),
  seoDescriptionEn: z.string().optional().nullable(),
  seoDescriptionAr: z.string().optional().nullable(),
  seoDescriptionKu: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  images: z.array(z.object({ url: z.string() })),
  thumbnail: z.string().optional().nullable(),
  datasheetUrl: z.string().optional().nullable(),
  seoImage: z.string().optional().nullable(),
  status: z.enum(["active", "draft", "archived"]),
  isFeatured: z.boolean(),
  sortOrder: z.number().min(0),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: ProductEntity | null;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const tForm = useTranslations("productForm");
  const tCommon = useTranslations("common");
  const { data: categories } = useProductCategories();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const isEditing = !!initialData;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      slug: "",
      nameEn: "",
      nameAr: "",
      nameKu: "",
      shortDescriptionEn: "",
      shortDescriptionAr: "",
      shortDescriptionKu: "",
      descriptionEn: "",
      descriptionAr: "",
      descriptionKu: "",
      seoTitleEn: "",
      seoTitleAr: "",
      seoTitleKu: "",
      seoDescriptionEn: "",
      seoDescriptionAr: "",
      seoDescriptionKu: "",
      categoryId: "",
      images: [],
      thumbnail: null,
      datasheetUrl: null,
      seoImage: null,
      status: "active",
      isFeatured: false,
      sortOrder: 0,
    },
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images",
  });

  useEffect(() => {
    if (initialData) {
      reset({
        slug: initialData.slug,
        nameEn: initialData.nameEn,
        nameAr: initialData.nameAr,
        nameKu: ((initialData as unknown as Record<string, unknown>).nameKu as string) ?? "",
        shortDescriptionEn: initialData.shortDescriptionEn ?? "",
        shortDescriptionAr: initialData.shortDescriptionAr ?? "",
        shortDescriptionKu: ((initialData as unknown as Record<string, unknown>).shortDescriptionKu as string) ?? "",
        descriptionEn: initialData.descriptionEn ?? "",
        descriptionAr: initialData.descriptionAr ?? "",
        descriptionKu: ((initialData as unknown as Record<string, unknown>).descriptionKu as string) ?? "",
        seoTitleEn: initialData.seoTitleEn ?? "",
        seoTitleAr: initialData.seoTitleAr ?? "",
        seoTitleKu: ((initialData as unknown as Record<string, unknown>).seoTitleKu as string) ?? "",
        seoDescriptionEn: initialData.seoDescriptionEn ?? "",
        seoDescriptionAr: initialData.seoDescriptionAr ?? "",
        seoDescriptionKu: ((initialData as unknown as Record<string, unknown>).seoDescriptionKu as string) ?? "",
        categoryId: initialData.categoryId ?? "",
        images: (initialData.images ?? []).map((url) => ({ url })),
        thumbnail: initialData.thumbnail,
        datasheetUrl: initialData.datasheetUrl,
        seoImage: initialData.seoImage,
        status: initialData.status,
        isFeatured: initialData.isFeatured,
        sortOrder: initialData.sortOrder,
      });
    }
  }, [initialData, reset]);

  const nameEnValue = watch("nameEn");
  const categoryIdValue = watch("categoryId");
  const statusValue = watch("status");
  const isFeaturedValue = watch("isFeatured");
  const thumbnailValue = watch("thumbnail");
  const datasheetUrlValue = watch("datasheetUrl");
  const seoImageValue = watch("seoImage");

  const generateSlug = () => {
    if (!nameEnValue) return;
    const slugified = nameEnValue
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setValue("slug", slugified, { shouldValidate: true });
  };

  const onSubmit = async (values: ProductFormValues) => {
    const imagesList = values.images.map((img) => img.url).filter(Boolean);
    const payload = {
      slug: values.slug,
      nameEn: values.nameEn,
      nameAr: values.nameAr,
      shortDescriptionEn: values.shortDescriptionEn || null,
      shortDescriptionAr: values.shortDescriptionAr || null,
      descriptionEn: values.descriptionEn || null,
      descriptionAr: values.descriptionAr || null,
      seoTitleEn: values.seoTitleEn || null,
      seoTitleAr: values.seoTitleAr || null,
      seoDescriptionEn: values.seoDescriptionEn || null,
      seoDescriptionAr: values.seoDescriptionAr || null,
      categoryId: values.categoryId || null,
      images: imagesList,
      thumbnail: values.thumbnail || (imagesList.length > 0 ? imagesList[0] : null),
      datasheetUrl: values.datasheetUrl || null,
      seoImage: values.seoImage || null,
      status: values.status,
      isFeatured: values.isFeatured,
      sortOrder: values.sortOrder,
    };

    if (isEditing && initialData) {
      await updateMutation.mutateAsync({ id: initialData.id, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    router.push("/admin/products");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditing ? `${tForm("editTitle")}: ${initialData?.nameEn}` : tForm("createTitle")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEditing ? tForm("editSubtitle") : tForm("createSubtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
            {tForm("cancel")}
          </Button>
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEditing ? tForm("saveChanges") : tForm("createBtn")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Main Content Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{tForm("contentTitle")}</CardTitle>
              <CardDescription>
                {tForm("contentSubtitle")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <MultilingualTabs
                englishFields={
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="nameEn">{tForm("nameEn")} *</Label>
                      <Input id="nameEn" {...register("nameEn")} />
                      {errors.nameEn && <span className="text-xs text-destructive">{errors.nameEn.message}</span>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="shortDescriptionEn">{tForm("shortEn")}</Label>
                      <Textarea id="shortDescriptionEn" rows={2} {...register("shortDescriptionEn")} />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="descriptionEn">{tForm("fullEn")}</Label>
                      <Textarea id="descriptionEn" rows={6} {...register("descriptionEn")} />
                    </div>

                    {/* SEO English Sub-section */}
                    <div className="border p-4 rounded-lg bg-muted/10 space-y-3">
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">SEO Meta (English)</h4>
                      <div className="space-y-1.5">
                        <Label htmlFor="seoTitleEn">Meta Title (English)</Label>
                        <Input id="seoTitleEn" {...register("seoTitleEn")} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="seoDescriptionEn">Meta Description (English)</Label>
                        <Textarea id="seoDescriptionEn" rows={2} {...register("seoDescriptionEn")} />
                      </div>
                    </div>
                  </div>
                }
                arabicFields={
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="nameAr">{tForm("nameAr")} *</Label>
                      <Input id="nameAr" dir="rtl" {...register("nameAr")} />
                      {errors.nameAr && <span className="text-xs text-destructive">{errors.nameAr.message}</span>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="shortDescriptionAr">{tForm("shortAr")}</Label>
                      <Textarea id="shortDescriptionAr" dir="rtl" rows={2} {...register("shortDescriptionAr")} />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="descriptionAr">{tForm("fullAr")}</Label>
                      <Textarea id="descriptionAr" dir="rtl" rows={6} {...register("descriptionAr")} />
                    </div>

                    {/* SEO Arabic Sub-section */}
                    <div className="border p-4 rounded-lg bg-muted/10 space-y-3">
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">تهيئة محركات البحث SEO (بالعربية)</h4>
                      <div className="space-y-1.5">
                        <Label htmlFor="seoTitleAr">عنوان SEO (بالعربية)</Label>
                        <Input id="seoTitleAr" dir="rtl" {...register("seoTitleAr")} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="seoDescriptionAr">وصف SEO (بالعربية)</Label>
                        <Textarea id="seoDescriptionAr" dir="rtl" rows={2} {...register("seoDescriptionAr")} />
                      </div>
                    </div>
                  </div>
                }
                kurdishFields={
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="nameKu">{tForm("nameKu")}</Label>
                      <Input id="nameKu" dir="rtl" {...register("nameKu")} />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="shortDescriptionKu">{tForm("shortKu")}</Label>
                      <Textarea id="shortDescriptionKu" dir="rtl" rows={2} {...register("shortDescriptionKu")} />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="descriptionKu">{tForm("fullKu")}</Label>
                      <Textarea id="descriptionKu" dir="rtl" rows={6} {...register("descriptionKu")} />
                    </div>

                    {/* SEO Kurdish Sub-section */}
                    <div className="border p-4 rounded-lg bg-muted/10 space-y-3">
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">SEO Meta (Kurdish)</h4>
                      <div className="space-y-1.5">
                        <Label htmlFor="seoTitleKu">Meta Title (Kurdish)</Label>
                        <Input id="seoTitleKu" dir="rtl" {...register("seoTitleKu")} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="seoDescriptionKu">Meta Description (Kurdish)</Label>
                        <Textarea id="seoDescriptionKu" dir="rtl" rows={2} {...register("seoDescriptionKu")} />
                      </div>
                    </div>
                  </div>
                }
              />
            </CardContent>
          </Card>

          {/* Media & Gallery Uploads */}
          <Card>
            <CardHeader>
              <CardTitle>{tForm("mediaTitle")}</CardTitle>
              <CardDescription>
                {tForm("mediaSubtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Thumbnail Image */}
              <ImageUploader
                label={tForm("thumbnailLabel")}
                value={thumbnailValue ?? null}
                onChange={(url) => setValue("thumbnail", url)}
                folder="product-thumbnails"
              />

              {/* Gallery Images List */}
              <div className="space-y-3 border p-4 rounded-lg bg-muted/10">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold text-sm">{tForm("galleryLabel")}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendImage({ url: "" })}
                    className="gap-1 text-xs"
                  >
                    <Plus className="h-3 w-3" /> {tForm("addImage")}
                  </Button>
                </div>

                {imageFields.map((field, idx) => (
                  <div key={field.id} className="space-y-2 p-3 border rounded bg-background">
                    <div className="flex items-center gap-2">
                      <Input
                        {...register(`images.${idx}.url`)}
                        placeholder="Image URL..."
                        className="text-xs"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-9 w-9 shrink-0"
                        onClick={() => removeImage(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <ImageUploader
                      label={`${tForm("galleryLabel")} #${idx + 1}`}
                      value={field.url}
                      onChange={(url) => setValue(`images.${idx}.url`, url ?? "")}
                      folder="products"
                    />
                  </div>
                ))}
              </div>

              {/* Technical Datasheet Upload */}
              <div className="space-y-2 border p-4 rounded-lg bg-muted/10">
                <Label className="font-semibold text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> {tForm("datasheetTitle")}
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    value={datasheetUrlValue ?? ""}
                    onChange={(e) => setValue("datasheetUrl", e.target.value)}
                    placeholder="PDF URL..."
                    className="text-xs"
                  />
                  <ImageUploader
                    label={tForm("uploadPdf")}
                    value={datasheetUrlValue ?? null}
                    onChange={(url) => setValue("datasheetUrl", url)}
                    folder="product-datasheets"
                  />
                </div>
              </div>

              {/* SEO Banner Image */}
              <ImageUploader
                label="Social Share Open Graph Image (SEO Image)"
                value={seoImageValue ?? null}
                onChange={(url) => setValue("seoImage", url)}
                folder="seo"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right 1-Col: Global Settings & Publishing */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{tForm("publishingTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Slug Generator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug">{tForm("slug")} *</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={generateSlug}
                    className="h-6 text-[11px] gap-1 text-primary"
                  >
                    <Sparkles className="h-3 w-3" /> {tForm("autoSlug")}
                  </Button>
                </div>
                <Input id="slug" {...register("slug")} placeholder="industrial-valve-x" />
                {errors.slug && <span className="text-xs text-destructive">{errors.slug.message}</span>}
              </div>

              {/* Category Select */}
              <div className="space-y-1.5">
                <Label>{tForm("category")}</Label>
                <Select
                  value={categoryIdValue ?? ""}
                  onValueChange={(val) => setValue("categoryId", val)}
                >
                  <SelectTrigger><SelectValue placeholder={tForm("selectCategory")} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Uncategorized</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.nameEn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Select */}
              <div className="space-y-1.5">
                <Label>{tForm("status")}</Label>
                <Select
                  value={statusValue}
                  onValueChange={(val: "active" | "draft" | "archived") => setValue("status", val)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{tCommon("active")}</SelectItem>
                    <SelectItem value="draft">{tCommon("draft")}</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between border p-3 rounded-lg">
                <div>
                  <Label className="font-semibold text-sm">{tForm("featured")}</Label>
                  <p className="text-xs text-muted-foreground">{tForm("featuredDesc")}</p>
                </div>
                <Switch
                  checked={isFeaturedValue}
                  onCheckedChange={(val) => setValue("isFeatured", val)}
                />
              </div>

              {/* Display Order */}
              <div className="space-y-1.5">
                <Label htmlFor="sortOrder">{tForm("sortOrder")}</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  {...register("sortOrder", { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
