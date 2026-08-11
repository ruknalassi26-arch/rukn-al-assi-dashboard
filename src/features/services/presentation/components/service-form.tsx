"use client";

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
  nameEn: z.string().min(2, "English name is required"),
  nameAr: z.string().optional().nullable(),
  nameKu: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  descriptionKu: z.string().optional().nullable(),
  applicationsEn: z.string().optional().nullable(),
  applicationsAr: z.string().optional().nullable(),
  applicationsKu: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  heroImageUrl: z.string().optional().nullable(),
  status: z.enum(["published", "draft", "archived"]),
  isFeatured: z.boolean(),
  featuredOrder: z.number().min(0).optional(),
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
  const isPending = createServiceMutation.isPending || updateServiceMutation.isPending;

  const enTrans = initialData?.getTranslation("en");
  const arTrans = initialData?.getTranslation("ar");
  const kuTrans = initialData?.getTranslation("ku");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      slug: initialData?.slug ?? "",
      nameEn: enTrans?.name ?? "",
      nameAr: arTrans?.name ?? "",
      nameKu: kuTrans?.name ?? "",
      descriptionEn: enTrans?.description ?? "",
      descriptionAr: arTrans?.description ?? "",
      descriptionKu: kuTrans?.description ?? "",
      applicationsEn: enTrans?.applications ?? "",
      applicationsAr: arTrans?.applications ?? "",
      applicationsKu: kuTrans?.applications ?? "",
      icon: initialData?.icon ?? "Wrench",
      heroImageUrl: initialData?.heroImageUrl ?? initialData?.image ?? null,
      status: (initialData?.status as "published" | "draft" | "archived") ?? "published",
      isFeatured: initialData?.isFeatured ?? false,
      featuredOrder: initialData?.featuredOrder ?? 0,
      sortOrder: initialData?.sortOrder ?? 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      const eT = initialData.getTranslation("en");
      const aT = initialData.getTranslation("ar");
      const kT = initialData.getTranslation("ku");

      reset({
        slug: initialData.slug ?? "",
        nameEn: eT?.name ?? "",
        nameAr: aT?.name ?? "",
        nameKu: kT?.name ?? "",
        descriptionEn: eT?.description ?? "",
        descriptionAr: aT?.description ?? "",
        descriptionKu: kT?.description ?? "",
        applicationsEn: eT?.applications ?? "",
        applicationsAr: aT?.applications ?? "",
        applicationsKu: kT?.applications ?? "",
        icon: initialData.icon ?? "Wrench",
        heroImageUrl: initialData.heroImageUrl ?? initialData.image ?? null,
        status: (initialData.status as "published" | "draft" | "archived") ?? "published",
        isFeatured: initialData.isFeatured,
        featuredOrder: initialData.featuredOrder ?? 0,
        sortOrder: initialData.sortOrder,
      });
    }
  }, [initialData, reset]);

  const nameEn = watch("nameEn");
  const slug = watch("slug");
  const statusValue = watch("status");
  const isFeaturedValue = watch("isFeatured");
  const heroImageUrlValue = watch("heroImageUrl");

  const generateSlug = () => {
    if (!nameEn) return;
    const generated = nameEn
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setValue("slug", generated, { shouldValidate: true });
  };

  const onSubmit = async (values: ServiceFormValues) => {
    try {
      const translations: Record<string, any> = {};

      if (values.nameEn?.trim()) {
        translations.en = {
          slug: values.slug,
          name: values.nameEn.trim(),
          description: values.descriptionEn?.trim() || null,
          applications: values.applicationsEn?.trim() || null,
        };
      }

      if (values.nameAr?.trim()) {
        translations.ar = {
          slug: values.slug,
          name: values.nameAr.trim(),
          description: values.descriptionAr?.trim() || null,
          applications: values.applicationsAr?.trim() || null,
        };
      }

      if (values.nameKu?.trim()) {
        translations.ku = {
          slug: values.slug,
          name: values.nameKu.trim(),
          description: values.descriptionKu?.trim() || null,
          applications: values.applicationsKu?.trim() || null,
        };
      }

      const payload = {
        icon: values.icon?.trim() || null,
        heroImageUrl: values.heroImageUrl || null,
        status: values.status,
        isFeatured: values.isFeatured,
        featuredOrder: values.featuredOrder ?? 0,
        sortOrder: values.sortOrder ?? 0,
        translations,
      };

      if (isEditing && initialData) {
        await updateServiceMutation.mutateAsync({
          id: initialData.id,
          ...payload,
        });
      } else {
        await createServiceMutation.mutateAsync(payload);
      }
      router.push("/admin/services");
    } catch {
      // Handled in mutation hooks
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
            onClick={() => router.push("/admin/services")}
            disabled={isPending}
          >
            {tForm("cancel")}
          </Button>
          <Button type="submit" disabled={isPending} className="gap-2 min-w-[140px]">
            {isPending ? (
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
        {/* Main Content Fields */}
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
                    <div className="space-y-1.5">
                      <Label htmlFor="nameEn">Service Title (EN) *</Label>
                      <Input id="nameEn" {...register("nameEn")} />
                      {errors.nameEn && (
                        <p className="text-xs font-semibold text-destructive">{errors.nameEn.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="descriptionEn">Description (EN)</Label>
                      <Textarea
                        id="descriptionEn"
                        className="min-h-[140px]"
                        {...register("descriptionEn")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="applicationsEn">Applications (EN)</Label>
                      <Textarea
                        id="applicationsEn"
                        className="min-h-[100px]"
                        placeholder="Industrial hydraulic systems, mobile machinery..."
                        {...register("applicationsEn")}
                      />
                    </div>
                  </div>
                }
                arabicFields={
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="nameAr">اسم الخدمة (عربي)</Label>
                      <Input id="nameAr" dir="rtl" {...register("nameAr")} />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="descriptionAr">الوصف (عربي)</Label>
                      <Textarea
                        id="descriptionAr"
                        dir="rtl"
                        className="min-h-[140px]"
                        {...register("descriptionAr")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="applicationsAr">التطبيقات الاستخدامية (عربي)</Label>
                      <Textarea
                        id="applicationsAr"
                        dir="rtl"
                        className="min-h-[100px]"
                        placeholder="الأنظمة الهيدروليكية الصناعية..."
                        {...register("applicationsAr")}
                      />
                    </div>
                  </div>
                }
                kurdishFields={
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="nameKu">ناوی خزمەتگوزاری (کوردی)</Label>
                      <Input id="nameKu" dir="rtl" {...register("nameKu")} />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="descriptionKu">پێناسە (کوردی)</Label>
                      <Textarea
                        id="descriptionKu"
                        dir="rtl"
                        className="min-h-[140px]"
                        {...register("descriptionKu")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="applicationsKu">بەکارهێنانەکان (کوردی)</Label>
                      <Textarea
                        id="applicationsKu"
                        dir="rtl"
                        className="min-h-[100px]"
                        {...register("applicationsKu")}
                      />
                    </div>
                  </div>
                }
              />
            </CardContent>
          </Card>

          {/* Service Cover Image */}
          <Card>
            <CardHeader>
              <CardTitle>Service Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                label="Hero Cover Image"
                value={heroImageUrlValue ?? null}
                onChange={(url) => setValue("heroImageUrl", url)}
                bucket="service-images"
                folder="covers"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{tForm("settingsTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Slug */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug">{tForm("slug")} *</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px] gap-1 px-1.5"
                    onClick={generateSlug}
                  >
                    <Sparkles className="h-3 w-3" /> {tForm("autoSlug")}
                  </Button>
                </div>
                <Input id="slug" {...register("slug")} />
                {errors.slug && (
                  <p className="text-xs font-semibold text-destructive">{errors.slug.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <Label htmlFor="status">{tForm("status")}</Label>
                <Select
                  value={statusValue}
                  onValueChange={(val: "published" | "draft" | "archived") => setValue("status", val)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Icon */}
              <div className="space-y-1.5">
                <Label htmlFor="icon">Lucide Icon Identifier</Label>
                <Input id="icon" {...register("icon")} placeholder="Wrench, Cpu, Cog..." />
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

              {/* Sort Order */}
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
