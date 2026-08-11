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
import { useTranslations } from "next-intl";
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
  const tForm = useTranslations("serviceForm");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const isEditing = !!initialData;

  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      slug: "",
      titleEn: "",
      titleAr: "",
      titleKu: "",
      shortDescriptionEn: "",
      shortDescriptionAr: "",
      shortDescriptionKu: "",
      descriptionEn: "",
      descriptionAr: "",
      descriptionKu: "",
      icon: "Wrench",
      image: null,
      seoTitleEn: "",
      seoTitleAr: "",
      seoTitleKu: "",
      seoDescriptionEn: "",
      seoDescriptionAr: "",
      seoDescriptionKu: "",
      seoImage: null,
      status: "active",
      isFeatured: false,
      sortOrder: 0,
    },
  });

  const titleEn = watch("titleEn");

  useEffect(() => {
    if (initialData) {
      reset({
        slug: initialData.slug,
        titleEn: initialData.titleEn,
        titleAr: initialData.titleAr,
        titleKu: initialData.titleKu ?? "",
        shortDescriptionEn: initialData.shortDescriptionEn ?? "",
        shortDescriptionAr: initialData.shortDescriptionAr ?? "",
        shortDescriptionKu: initialData.shortDescriptionKu ?? "",
        descriptionEn: initialData.descriptionEn ?? "",
        descriptionAr: initialData.descriptionAr ?? "",
        descriptionKu: initialData.descriptionKu ?? "",
        icon: initialData.icon ?? "Wrench",
        image: initialData.image ?? null,
        seoTitleEn: initialData.seoTitleEn ?? "",
        seoTitleAr: initialData.seoTitleAr ?? "",
        seoTitleKu: initialData.seoTitleKu ?? "",
        seoDescriptionEn: initialData.seoDescriptionEn ?? "",
        seoDescriptionAr: initialData.seoDescriptionAr ?? "",
        seoDescriptionKu: initialData.seoDescriptionKu ?? "",
        seoImage: initialData.seoImage ?? null,
        status: initialData.status,
        isFeatured: initialData.isFeatured,
        sortOrder: initialData.sortOrder,
      });
    }
  }, [initialData, reset]);

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
              {isEditing ? `${tForm("editTitle")}: ${initialData.titleEn}` : tForm("createTitle")}
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
            onClick={() => router.push("/admin/services")}
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
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
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
                      <Label htmlFor="titleEn">{tForm("titleEn")} *</Label>
                      <Input id="titleEn" {...register("titleEn")} />
                      {errors.titleEn && (
                        <p className="text-xs font-semibold text-destructive">{errors.titleEn.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shortDescriptionEn">{tForm("shortEn")}</Label>
                      <Textarea id="shortDescriptionEn" className="min-h-[70px]" {...register("shortDescriptionEn")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionEn">{tForm("fullEn")}</Label>
                      <Textarea id="descriptionEn" className="min-h-[140px]" {...register("descriptionEn")} />
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">{tForm("seoHeadingEn")}</h4>
                      <div className="space-y-2">
                        <Label htmlFor="seoTitleEn">{tForm("seoTitleEn")}</Label>
                        <Input id="seoTitleEn" {...register("seoTitleEn")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seoDescriptionEn">{tForm("seoDescEn")}</Label>
                        <Textarea id="seoDescriptionEn" className="min-h-[70px]" {...register("seoDescriptionEn")} />
                      </div>
                    </div>
                  </div>
                }
                arabicFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="titleAr">{tForm("titleAr")} *</Label>
                      <Input id="titleAr" dir="rtl" {...register("titleAr")} />
                      {errors.titleAr && (
                        <p className="text-xs font-semibold text-destructive">{errors.titleAr.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shortDescriptionAr">{tForm("shortAr")}</Label>
                      <Textarea id="shortDescriptionAr" dir="rtl" className="min-h-[70px]" {...register("shortDescriptionAr")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionAr">{tForm("fullAr")}</Label>
                      <Textarea id="descriptionAr" dir="rtl" className="min-h-[140px]" {...register("descriptionAr")} />
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">{tForm("seoHeadingAr")}</h4>
                      <div className="space-y-2">
                        <Label htmlFor="seoTitleAr">{tForm("seoTitleAr")}</Label>
                        <Input id="seoTitleAr" dir="rtl" {...register("seoTitleAr")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seoDescriptionAr">{tForm("seoDescAr")}</Label>
                        <Textarea id="seoDescriptionAr" dir="rtl" className="min-h-[70px]" {...register("seoDescriptionAr")} />
                      </div>
                    </div>
                  </div>
                }
                kurdishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="titleKu">{tForm("titleKu")}</Label>
                      <Input id="titleKu" dir="rtl" {...register("titleKu")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shortDescriptionKu">{tForm("shortKu")}</Label>
                      <Textarea id="shortDescriptionKu" dir="rtl" className="min-h-[70px]" {...register("shortDescriptionKu")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionKu">{tForm("fullKu")}</Label>
                      <Textarea id="descriptionKu" dir="rtl" className="min-h-[140px]" {...register("descriptionKu")} />
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">{tForm("seoHeadingKu")}</h4>
                      <div className="space-y-2">
                        <Label htmlFor="seoTitleKu">{tForm("seoTitleKu")}</Label>
                        <Input id="seoTitleKu" dir="rtl" {...register("seoTitleKu")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seoDescriptionKu">{tForm("seoDescKu")}</Label>
                        <Textarea id="seoDescriptionKu" dir="rtl" className="min-h-[70px]" {...register("seoDescriptionKu")} />
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
              <CardTitle>{tForm("publishingTitle")}</CardTitle>
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

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="isFeatured" className="text-sm font-semibold">{tForm("featured")}</Label>
                  <p className="text-xs text-muted-foreground">{tForm("featuredDesc")}</p>
                </div>
                <Switch
                  id="isFeatured"
                  checked={watch("isFeatured")}
                  onCheckedChange={(checked) => setValue("isFeatured", checked)}
                />
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

          {/* Service Image */}
          <Card>
            <CardHeader>
              <CardTitle>Service Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                value={watch("image") ?? ""}
                onChange={(url) => setValue("image", url)}
                bucket="service-images"
                folder="cover"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
