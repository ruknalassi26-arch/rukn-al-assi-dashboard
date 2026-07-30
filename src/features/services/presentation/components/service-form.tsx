"use client";
// ==============================================================================
// features/services/presentation/components/service-form.tsx
// Service Creation / Editing Form with RHF + Zod + MultilingualTabs
// ==============================================================================
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, ArrowLeft, Sparkles, Wrench } from "lucide-react";
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
import { useCreateService, useUpdateService } from "@shared/hooks/services/use-service-hooks";
import type { ServiceEntity } from "../../domain/entities/service.entity";

const serviceSchema = z.object({
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and hyphens"),
  titleEn: z.string().min(2, "English title is required"),
  titleAr: z.string().min(2, "Arabic title is required"),
  titleKu: z.string().optional().nullable(),
  shortDescriptionEn: z.string().optional().nullable(),
  shortDescriptionAr: z.string().optional().nullable(),
  shortDescriptionKu: z.string().optional().nullable(),
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
  seoImage: z.string().optional().nullable(),
  status: z.enum(["active", "draft"]),
  isFeatured: z.boolean(),
  sortOrder: z.number().min(0),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  initialData?: ServiceEntity | null;
}

export function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const isSubmitting = createServiceMutation.isPending || updateServiceMutation.isPending;

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
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
      icon: initialData?.icon ?? "",
      image: initialData?.image ?? "",
      seoTitleEn: initialData?.seoTitleEn ?? "",
      seoTitleAr: initialData?.seoTitleAr ?? "",
      seoTitleKu: initialData?.seoTitleKu ?? "",
      seoDescriptionEn: initialData?.seoDescriptionEn ?? "",
      seoDescriptionAr: initialData?.seoDescriptionAr ?? "",
      seoDescriptionKu: initialData?.seoDescriptionKu ?? "",
      seoImage: initialData?.seoImage ?? "",
      status: initialData?.status ?? "active",
      isFeatured: initialData?.isFeatured ?? false,
      sortOrder: initialData?.sortOrder ?? 0,
    },
  });

  const { watch, setValue, register, handleSubmit, formState: { errors } } = form;
  const titleEn = watch("titleEn");
  const slug = watch("slug");

  // Auto slug generator from English Title if not manually overridden
  useEffect(() => {
    if (!isEditing && titleEn && !slug) {
      const generatedSlug = titleEn
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [titleEn, slug, isEditing, setValue]);

  const onSubmit = async (values: ServiceFormValues) => {
    try {
      if (isEditing && initialData) {
        await updateServiceMutation.mutateAsync({
          id: initialData.id,
          ...values,
        });
      } else {
        await createServiceMutation.mutateAsync(values);
      }
      router.push("/admin/services");
    } catch {
      // Toast notifications handled in mutations
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
            onClick={() => router.push("/admin/services")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditing ? `Edit Service: ${initialData.titleEn}` : "Create New Service"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage service details, multilingual content, featured flags, and SEO settings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/services")}
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
                <Save className="h-4 w-4" /> {isEditing ? "Update Service" : "Save Service"}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                Service Content
              </CardTitle>
              <CardDescription>
                Provide service titles and descriptions across languages using language tabs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MultilingualTabs
                englishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="titleEn">Service Title (English) *</Label>
                      <Input
                        id="titleEn"
                        placeholder="e.g. Hydraulic Cylinder Repair"
                        {...register("titleEn")}
                      />
                      {errors.titleEn && (
                        <p className="text-xs font-semibold text-destructive">{errors.titleEn.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shortDescriptionEn">Short Description (English)</Label>
                      <Textarea
                        id="shortDescriptionEn"
                        placeholder="Brief summary for service cards..."
                        className="min-h-[70px]"
                        {...register("shortDescriptionEn")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionEn">Full Description (English)</Label>
                      <Textarea
                        id="descriptionEn"
                        placeholder="Detailed service capabilities and process..."
                        className="min-h-[140px]"
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
                      <Label htmlFor="titleAr">عنوان الخدمة (بالعربية) *</Label>
                      <Input
                        id="titleAr"
                        placeholder="مثال: إصلاح الاسطوانات الهيدروليكية"
                        {...register("titleAr")}
                      />
                      {errors.titleAr && (
                        <p className="text-xs font-semibold text-destructive">{errors.titleAr.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shortDescriptionAr">الوصف المختصر (بالعربية)</Label>
                      <Textarea
                        id="shortDescriptionAr"
                        placeholder="ملخص قصير للخدمة..."
                        className="min-h-[70px]"
                        {...register("shortDescriptionAr")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionAr">الوصف الكامل (بالعربية)</Label>
                      <Textarea
                        id="descriptionAr"
                        placeholder="تفاصيل الخدمة ومراحل التنفيذ..."
                        className="min-h-[140px]"
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
                      <Label htmlFor="titleKu">سەرناوی خزمەتگوزاری (بە کوردی)</Label>
                      <Input
                        id="titleKu"
                        placeholder="نموونە: چاککردنەوەی سلندری هایدرۆلیکی"
                        {...register("titleKu")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shortDescriptionKu">پوختەی کورتی خزمەتگوزاری (بە کوردی)</Label>
                      <Textarea
                        id="shortDescriptionKu"
                        placeholder="کورتەیەک لەبارەی خزمەتگوزارییەکەوە..."
                        className="min-h-[70px]"
                        {...register("shortDescriptionKu")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionKu">وەسفی تەواوی خزمەتگوزاری (بە کوردی)</Label>
                      <Textarea
                        id="descriptionKu"
                        placeholder="ووردەکاری و قۆناغەکانی جێبەجێکردنی خزمەتگوزارییەکە..."
                        className="min-h-[140px]"
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

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings & Options</CardTitle>
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
                      if (titleEn) {
                        const generatedSlug = titleEn
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
                <Input id="slug" placeholder="e.g. hydraulic-cylinder-repair" {...register("slug")} />
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
                    <SelectItem value="active">Active (Published)</SelectItem>
                    <SelectItem value="draft">Draft (Hidden)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="isFeatured" className="text-sm font-semibold">Featured Service</Label>
                  <p className="text-xs text-muted-foreground">Highlight on home & service section</p>
                </div>
                <Switch
                  id="isFeatured"
                  checked={watch("isFeatured")}
                  onCheckedChange={(checked) => setValue("isFeatured", checked)}
                />
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
                <Label htmlFor="icon">Lucide Icon Name (Optional)</Label>
                <Input id="icon" placeholder="e.g. Wrench, Shield, Settings" {...register("icon")} />
              </div>
            </CardContent>
          </Card>

          {/* Service Image */}
          <Card>
            <CardHeader>
              <CardTitle>Service Cover Image</CardTitle>
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
