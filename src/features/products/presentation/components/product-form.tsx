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
import { BilingualTabs } from "@shared/components/bilingual-tabs";
import { ImageUploader } from "@shared/upload/image-uploader";
import { useProductCategories, useCreateProduct, useUpdateProduct } from "@shared/hooks/products/use-product-hooks";
import type { ProductEntity } from "../../domain/entities/product.entity";

const productSchema = z.object({
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and hyphens"),
  nameEn: z.string().min(2, "English name is required"),
  nameAr: z.string().min(2, "Arabic name is required"),
  shortDescriptionEn: z.string().optional().nullable(),
  shortDescriptionAr: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  seoTitleEn: z.string().optional().nullable(),
  seoTitleAr: z.string().optional().nullable(),
  seoDescriptionEn: z.string().optional().nullable(),
  seoDescriptionAr: z.string().optional().nullable(),
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
      shortDescriptionEn: "",
      shortDescriptionAr: "",
      descriptionEn: "",
      descriptionAr: "",
      seoTitleEn: "",
      seoTitleAr: "",
      seoDescriptionEn: "",
      seoDescriptionAr: "",
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
        shortDescriptionEn: initialData.shortDescriptionEn ?? "",
        shortDescriptionAr: initialData.shortDescriptionAr ?? "",
        descriptionEn: initialData.descriptionEn ?? "",
        descriptionAr: initialData.descriptionAr ?? "",
        seoTitleEn: initialData.seoTitleEn ?? "",
        seoTitleAr: initialData.seoTitleAr ?? "",
        seoDescriptionEn: initialData.seoDescriptionEn ?? "",
        seoDescriptionAr: initialData.seoDescriptionAr ?? "",
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
              {isEditing ? `Edit Product: ${initialData?.nameEn}` : "Create New Product"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill in bilingual details, select categories, upload gallery assets and datasheet specifications.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEditing ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Main Content Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multilingual Product Content</CardTitle>
              <CardDescription>
                Switch tabs to enter English and Arabic titles, descriptions, and SEO details. Unsaved changes are preserved across tabs.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <BilingualTabs
                englishFields={
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="nameEn">Product Name (English) *</Label>
                      <Input id="nameEn" {...register("nameEn")} placeholder="e.g. High Pressure Industrial Valve" />
                      {errors.nameEn && <span className="text-xs text-destructive">{errors.nameEn.message}</span>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="shortDescriptionEn">Short Summary (English)</Label>
                      <Textarea id="shortDescriptionEn" rows={2} {...register("shortDescriptionEn")} placeholder="Brief overview for cards & previews..." />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="descriptionEn">Full Description & Specifications (English)</Label>
                      <Textarea id="descriptionEn" rows={6} {...register("descriptionEn")} placeholder="Comprehensive product specifications, features, applications..." />
                    </div>

                    {/* SEO English Sub-section */}
                    <div className="border p-4 rounded-lg bg-muted/10 space-y-3">
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">SEO Meta (English)</h4>
                      <div className="space-y-1.5">
                        <Label htmlFor="seoTitleEn">Meta Title (English)</Label>
                        <Input id="seoTitleEn" {...register("seoTitleEn")} placeholder="Custom browser title tag" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="seoDescriptionEn">Meta Description (English)</Label>
                        <Textarea id="seoDescriptionEn" rows={2} {...register("seoDescriptionEn")} placeholder="Search engine snippet text..." />
                      </div>
                    </div>
                  </div>
                }
                arabicFields={
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="nameAr">اسم المنتج (بالعربية) *</Label>
                      <Input id="nameAr" dir="rtl" {...register("nameAr")} placeholder="مثال: صمام صناعي عالي الضغط" />
                      {errors.nameAr && <span className="text-xs text-destructive">{errors.nameAr.message}</span>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="shortDescriptionAr">الملخص القصير (بالعربية)</Label>
                      <Textarea id="shortDescriptionAr" dir="rtl" rows={2} {...register("shortDescriptionAr")} placeholder="نبذة مختصرة للعرض في القوائم..." />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="descriptionAr">الوصف الكامل والمواصفات (بالعربية)</Label>
                      <Textarea id="descriptionAr" dir="rtl" rows={6} {...register("descriptionAr")} placeholder="شرح تفصيلي للمنتج والمواصفات الفنية..." />
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
              />
            </CardContent>
          </Card>

          {/* Media & Gallery Uploads */}
          <Card>
            <CardHeader>
              <CardTitle>Product Media & Gallery Assets</CardTitle>
              <CardDescription>
                Upload high-resolution product images and technical PDF datasheets to Supabase Storage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Thumbnail Image */}
              <ImageUploader
                label="Primary Product Thumbnail Image"
                value={thumbnailValue ?? null}
                onChange={(url) => setValue("thumbnail", url)}
                folder="product-thumbnails"
              />

              {/* Gallery Images List */}
              <div className="space-y-3 border p-4 rounded-lg bg-muted/10">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold text-sm">Product Gallery Images</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendImage({ url: "" })}
                    className="gap-1 text-xs"
                  >
                    <Plus className="h-3 w-3" /> Add Image URL / Slot
                  </Button>
                </div>

                {imageFields.map((field, idx) => (
                  <div key={field.id} className="space-y-2 p-3 border rounded bg-background">
                    <div className="flex items-center gap-2">
                      <Input
                        {...register(`images.${idx}.url`)}
                        placeholder="Image URL or upload below..."
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
                      label={`Gallery Image #${idx + 1}`}
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
                  <FileText className="h-4 w-4 text-primary" /> Technical PDF Datasheet Document
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    value={datasheetUrlValue ?? ""}
                    onChange={(e) => setValue("datasheetUrl", e.target.value)}
                    placeholder="PDF URL or upload via storage..."
                    className="text-xs"
                  />
                  <ImageUploader
                    label="Upload PDF / File"
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
              <CardTitle>Publishing & Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Slug Generator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={generateSlug}
                    className="h-6 text-[11px] gap-1 text-primary"
                  >
                    <Sparkles className="h-3 w-3" /> Auto Slug
                  </Button>
                </div>
                <Input id="slug" {...register("slug")} placeholder="industrial-valve-x" />
                {errors.slug && <span className="text-xs text-destructive">{errors.slug.message}</span>}
              </div>

              {/* Category Select */}
              <div className="space-y-1.5">
                <Label>Product Category</Label>
                <Select
                  value={categoryIdValue ?? ""}
                  onValueChange={(val) => setValue("categoryId", val)}
                >
                  <SelectTrigger><SelectValue placeholder="Select a category..." /></SelectTrigger>
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
                <Label>Visibility Status</Label>
                <Select
                  value={statusValue}
                  onValueChange={(val: "active" | "draft" | "archived") => setValue("status", val)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active (Visible)</SelectItem>
                    <SelectItem value="draft">Draft (Hidden)</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between border p-3 rounded-lg">
                <div>
                  <Label className="font-semibold text-sm">Feature on Homepage</Label>
                  <p className="text-xs text-muted-foreground">Highlight in featured products carousel.</p>
                </div>
                <Switch
                  checked={isFeaturedValue}
                  onCheckedChange={(val) => setValue("isFeatured", val)}
                />
              </div>

              {/* Display Order */}
              <div className="space-y-1.5">
                <Label htmlFor="sortOrder">Display Sort Order</Label>
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
