"use client";

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
  sku: z.string().optional().nullable(),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and hyphens"),
  nameEn: z.string().min(2, "English name is required"),
  nameAr: z.string().optional().nullable(),
  nameKu: z.string().optional().nullable(),
  shortDescriptionEn: z.string().optional().nullable(),
  shortDescriptionAr: z.string().optional().nullable(),
  shortDescriptionKu: z.string().optional().nullable(),
  specificationsEn: z.string().optional().nullable(),
  specificationsAr: z.string().optional().nullable(),
  specificationsKu: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  images: z.array(z.object({ url: z.string() })),
  thumbnail: z.string().optional().nullable(),
  datasheetUrl: z.string().optional().nullable(),
  status: z.enum(["published", "draft", "archived"]),
  isFeatured: z.boolean(),
  featuredOrder: z.number().min(0).optional(),
  sortOrder: z.number().min(0),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: ProductEntity | null;
}

function parseSpecifications(text?: string | null): Record<string, any> | null {
  if (!text || text.trim() === "") return null;
  try {
    const trimmed = text.trim();
    if (trimmed.startsWith("{")) return JSON.parse(trimmed);
  } catch {}

  const lines = text.split("\n");
  const obj: Record<string, any> = {};
  for (const line of lines) {
    const parts = line.split(":");
    if (parts.length >= 2) {
      const k = parts[0].trim();
      const v = parts.slice(1).join(":").trim();
      if (k) obj[k] = v;
    } else if (line.trim()) {
      obj[`spec_${Object.keys(obj).length + 1}`] = line.trim();
    }
  }
  return Object.keys(obj).length > 0 ? obj : { details: text.trim() };
}

function formatSpecificationsForEdit(specs: any): string {
  if (!specs) return "";
  if (typeof specs === "string") return specs;
  if (typeof specs === "object") {
    return Object.entries(specs)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
  }
  return String(specs);
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

  const enTrans = initialData?.getTranslation("en");
  const arTrans = initialData?.getTranslation("ar");
  const kuTrans = initialData?.getTranslation("ku");

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
      sku: initialData?.sku ?? "",
      slug: initialData?.slug ?? "",
      nameEn: enTrans?.name ?? "",
      nameAr: arTrans?.name ?? "",
      nameKu: kuTrans?.name ?? "",
      shortDescriptionEn: enTrans?.shortDescription ?? "",
      shortDescriptionAr: arTrans?.shortDescription ?? "",
      shortDescriptionKu: kuTrans?.shortDescription ?? "",
      specificationsEn: formatSpecificationsForEdit(enTrans?.specifications),
      specificationsAr: formatSpecificationsForEdit(arTrans?.specifications),
      specificationsKu: formatSpecificationsForEdit(kuTrans?.specifications),
      categoryId: initialData?.categoryId ?? "",
      images: (initialData?.galleryImages ?? []).map((url) => ({ url })),
      thumbnail: initialData?.thumbnail ?? null,
      datasheetUrl: initialData?.datasheetUrl ?? null,
      status: (initialData?.status as "published" | "draft" | "archived") ?? "published",
      isFeatured: initialData?.isFeatured ?? false,
      featuredOrder: initialData?.featuredOrder ?? 0,
      sortOrder: initialData?.sortOrder ?? 0,
    },
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images",
  });

  useEffect(() => {
    if (initialData) {
      const eT = initialData.getTranslation("en");
      const aT = initialData.getTranslation("ar");
      const kT = initialData.getTranslation("ku");

      reset({
        sku: initialData.sku ?? "",
        slug: initialData.slug ?? "",
        nameEn: eT?.name ?? "",
        nameAr: aT?.name ?? "",
        nameKu: kT?.name ?? "",
        shortDescriptionEn: eT?.shortDescription ?? "",
        shortDescriptionAr: aT?.shortDescription ?? "",
        shortDescriptionKu: kT?.shortDescription ?? "",
        specificationsEn: formatSpecificationsForEdit(eT?.specifications),
        specificationsAr: formatSpecificationsForEdit(aT?.specifications),
        specificationsKu: formatSpecificationsForEdit(kT?.specifications),
        categoryId: initialData.categoryId ?? "",
        images: (initialData.galleryImages ?? []).map((url) => ({ url })),
        thumbnail: initialData.thumbnail,
        datasheetUrl: initialData.datasheetUrl,
        status: (initialData.status as "published" | "draft" | "archived") ?? "published",
        isFeatured: initialData.isFeatured,
        featuredOrder: initialData.featuredOrder ?? 0,
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
    // 1. Translations dictionary per language
    const translations: Record<string, any> = {};

    if (values.nameEn?.trim()) {
      translations.en = {
        slug: values.slug,
        name: values.nameEn.trim(),
        shortDescription: values.shortDescriptionEn?.trim() || null,
        specifications: parseSpecifications(values.specificationsEn),
      };
    }

    if (values.nameAr?.trim()) {
      translations.ar = {
        slug: values.slug,
        name: values.nameAr.trim(),
        shortDescription: values.shortDescriptionAr?.trim() || null,
        specifications: parseSpecifications(values.specificationsAr),
      };
    }

    if (values.nameKu?.trim()) {
      translations.ku = {
        slug: values.slug,
        name: values.nameKu.trim(),
        shortDescription: values.shortDescriptionKu?.trim() || null,
        specifications: parseSpecifications(values.specificationsKu),
      };
    }

    // 2. Structured Product Images Array
    const images: Array<{ imageUrl: string; isPrimary: boolean; sortOrder: number }> = [];
    if (values.thumbnail) {
      images.push({
        imageUrl: values.thumbnail,
        isPrimary: true,
        sortOrder: 0,
      });
    }

    values.images.forEach((img, idx) => {
      if (img.url?.trim()) {
        images.push({
          imageUrl: img.url.trim(),
          isPrimary: false,
          sortOrder: idx + 1,
        });
      }
    });

    const payload = {
      sku: values.sku?.trim() || null,
      slug: values.slug,
      categoryId: values.categoryId && values.categoryId !== "none" ? values.categoryId : null,
      datasheetUrl: values.datasheetUrl || null,
      status: values.status,
      isFeatured: values.isFeatured,
      featuredOrder: values.featuredOrder ?? 0,
      sortOrder: values.sortOrder ?? 0,
      translations,
      images,
    };

    if (isEditing && initialData) {
      await updateMutation.mutateAsync({ id: initialData.id, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    router.push("/admin/products");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 border-b pb-4">
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
          <Button type="submit" disabled={isPending} className="gap-2 min-w-[140px]">
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
                      <Label htmlFor="specificationsEn">Specifications</Label>
                      <Textarea
                        id="specificationsEn"
                        rows={6}
                        placeholder={"Pressure: 250 bar\nFlow Rate: 120 L/min\nMaterial: Stainless Steel"}
                        {...register("specificationsEn")}
                      />
                      <p className="text-[11px] text-muted-foreground">Enter technical specifications (Key: Value pairs per line).</p>
                    </div>
                  </div>
                }
                arabicFields={
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="nameAr">{tForm("nameAr")}</Label>
                      <Input id="nameAr" dir="rtl" {...register("nameAr")} />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="shortDescriptionAr">{tForm("shortAr")}</Label>
                      <Textarea id="shortDescriptionAr" dir="rtl" rows={2} {...register("shortDescriptionAr")} />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="specificationsAr">المواصفات الفنية</Label>
                      <Textarea
                        id="specificationsAr"
                        dir="rtl"
                        rows={6}
                        placeholder={"الضغط: 250 بار\nمعدل التدفق: 120 لتر/دقيقة"}
                        {...register("specificationsAr")}
                      />
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
                      <Label htmlFor="specificationsKu">تایبەتمەندییە تەکنیکییەکان</Label>
                      <Textarea
                        id="specificationsKu"
                        dir="rtl"
                        rows={6}
                        placeholder={"پەستان: 250 بار"}
                        {...register("specificationsKu")}
                      />
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
                bucket="product-images"
                folder="thumbnails"
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
                      bucket="product-images"
                      folder="gallery"
                    />
                  </div>
                ))}
              </div>

              {/* Technical Datasheet Upload (PDF Only) */}
              <div className="space-y-2 border p-4 rounded-lg bg-muted/10">
                <Label className="font-semibold text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> {tForm("datasheetTitle")}
                </Label>
                <ImageUploader
                  label="Upload Technical PDF Datasheet"
                  value={datasheetUrlValue ?? null}
                  onChange={(url) => setValue("datasheetUrl", url)}
                  bucket="product-datasheets"
                  folder="datasheets"
                  fileType="pdf"
                  accept="application/pdf"
                  hintText="PDF (max 10MB)"
                />
              </div>
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
              {/* Product SKU */}
              <div className="space-y-1.5">
                <Label htmlFor="sku">Product SKU</Label>
                <Input id="sku" {...register("sku")} placeholder="SKU-HYD-1001" />
              </div>

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
                <Input id="slug" {...register("slug")} placeholder="hydraulic-pump-x1" />
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
                  onValueChange={(val: "published" | "draft" | "archived") => setValue("status", val)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
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

              {/* Featured Order */}
              {isFeaturedValue && (
                <div className="space-y-1.5">
                  <Label htmlFor="featuredOrder">Featured Order</Label>
                  <Input
                    id="featuredOrder"
                    type="number"
                    min={0}
                    {...register("featuredOrder", { valueAsNumber: true })}
                  />
                </div>
              )}

              {/* Display Sort Order */}
              <div className="space-y-1.5">
                <Label htmlFor="sortOrder">{tForm("sortOrder")}</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min={0}
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
