"use client";
// ==============================================================================
// features/seo/presentation/components/seo-form.tsx
// Public Website Pages SEO Metadata Form Component
// ==============================================================================
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Save,
  Search,
  Globe,
  Image as ImageIcon,
  ShieldAlert,
} from "lucide-react";
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
  Skeleton,
} from "@shared/ui";
import { MultilingualTabs } from "@shared/components/multilingual-tabs";
import { ImageUploader } from "@shared/upload/image-uploader";
import { useSeoSetting, useUpdateSeoSetting } from "@shared/hooks/seo/use-seo-hooks";
import { ErrorState } from "@shared/components/error-state";
import { useSeoStore } from "../stores/seo.store";
import { GoogleSearchPreview } from "./google-search-preview";
import { SEO_PAGE_LABELS } from "../../domain/enums/seo.enums";
import type { SeoPageKey } from "../../domain/entities/seo-setting.entity";

const seoSchema = z.object({
  pageKey: z.enum(["home", "about", "products", "categories", "services", "projects", "certificates", "contact", "careers"]),
  metaTitleEn: z.string().max(70, "Meta Title should be under 70 characters").optional().nullable(),
  metaTitleAr: z.string().max(70, "عنوان SEO يجب ألا يتجاوز 70 حرفاً").optional().nullable(),
  metaTitleKu: z.string().optional().nullable(),
  metaDescriptionEn: z.string().max(180, "Meta Description should be under 180 characters").optional().nullable(),
  metaDescriptionAr: z.string().max(180, "وصف SEO يجب ألا يتجاوز 180 حرفاً").optional().nullable(),
  metaDescriptionKu: z.string().optional().nullable(),
  keywordsEn: z.string().optional().nullable(),
  keywordsAr: z.string().optional().nullable(),
  keywordsKu: z.string().optional().nullable(),
  ogImageUrl: z.string().optional().nullable(),
  isIndexed: z.boolean(),
});

export type SeoFormValues = z.infer<typeof seoSchema>;

export function SeoForm() {
  const t = useTranslations("seo");
  const { selectedPageKey, setSelectedPageKey } = useSeoStore();
  const { data: seoData, isLoading, error, refetch } = useSeoSetting(selectedPageKey);
  const updateSeoMutation = useUpdateSeoSetting();

  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoSchema),
    values: {
      pageKey: selectedPageKey,
      metaTitleEn: seoData?.metaTitleEn ?? "",
      metaTitleAr: seoData?.metaTitleAr ?? "",
      metaTitleKu: seoData?.metaTitleKu ?? "",
      metaDescriptionEn: seoData?.metaDescriptionEn ?? "",
      metaDescriptionAr: seoData?.metaDescriptionAr ?? "",
      metaDescriptionKu: seoData?.metaDescriptionKu ?? "",
      keywordsEn: seoData?.keywordsEn ?? "",
      keywordsAr: seoData?.keywordsAr ?? "",
      keywordsKu: seoData?.keywordsKu ?? "",
      ogImageUrl: seoData?.ogImageUrl ?? "",
      isIndexed: seoData?.isIndexed ?? true,
    },
  });

  const { watch, setValue, register, handleSubmit, formState: { errors } } = form;

  const currentTitleEn = watch("metaTitleEn") || "";
  const currentDescEn = watch("metaDescriptionEn") || "";
  const isIndexed = watch("isIndexed");

  const onSubmit = async (values: SeoFormValues) => {
    await updateSeoMutation.mutateAsync(values);
  };

  if (isLoading) {
    return (
      <Card className="max-w-5xl mx-auto">
        <CardHeader><Skeleton className="h-8 w-64" /></CardHeader>
        <CardContent className="space-y-4"><Skeleton className="h-64 w-full" /></CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load SEO settings"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Select Target Page */}
          <div className="w-52">
            <Select
              value={selectedPageKey}
              onValueChange={(val) => setSelectedPageKey(val as SeoPageKey)}
            >
              <SelectTrigger className="h-10 font-medium">
                <SelectValue placeholder="Select Page" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(SEO_PAGE_LABELS) as SeoPageKey[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {SEO_PAGE_LABELS[key].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={updateSeoMutation.isPending} className="gap-2 min-w-[140px]">
            {updateSeoMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> {t("save")}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Live Google Search Snippet Preview */}
      <GoogleSearchPreview
        pageKey={selectedPageKey}
        title={currentTitleEn}
        description={currentDescEn}
        isIndexed={isIndexed}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Multilingual SEO Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                {t("metaCardTitle")}
              </CardTitle>
              <CardDescription>
                {t("metaCardSubtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MultilingualTabs
                englishFields={
                  <div className="space-y-4">
                    {/* Meta Title En */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="metaTitleEn">Meta Title (English)</Label>
                        <span className={`text-xs font-mono ${currentTitleEn.length > 60 ? "text-amber-600 font-bold" : "text-muted-foreground"}`}>
                          {currentTitleEn.length} / 60 chars
                        </span>
                      </div>
                      <Input
                        id="metaTitleEn"
                        placeholder={`e.g. ${SEO_PAGE_LABELS[selectedPageKey].label} | Rukn Al Assi`}
                        {...register("metaTitleEn")}
                      />
                      {errors.metaTitleEn && <p className="text-xs font-semibold text-destructive">{errors.metaTitleEn.message}</p>}
                    </div>

                    {/* Meta Description En */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="metaDescriptionEn">Meta Description (English)</Label>
                        <span className={`text-xs font-mono ${currentDescEn.length > 160 ? "text-amber-600 font-bold" : "text-muted-foreground"}`}>
                          {currentDescEn.length} / 160 chars
                        </span>
                      </div>
                      <Textarea
                        id="metaDescriptionEn"
                        placeholder="Concise summary for search engines (max 160 characters)..."
                        className="min-h-[90px]"
                        {...register("metaDescriptionEn")}
                      />
                      {errors.metaDescriptionEn && <p className="text-xs font-semibold text-destructive">{errors.metaDescriptionEn.message}</p>}
                    </div>

                    {/* Keywords En */}
                    <div className="space-y-2">
                      <Label htmlFor="keywordsEn">Search Keywords (English)</Label>
                      <Input
                        id="keywordsEn"
                        placeholder="hydraulic systems, industrial pumps, machinery, Iraq"
                        {...register("keywordsEn")}
                      />
                    </div>
                  </div>
                }
                arabicFields={
                  <div className="space-y-4">
                    {/* Meta Title Ar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="metaTitleAr">عنوان SEO (بالعربية)</Label>
                        <span className="text-xs font-mono text-muted-foreground">
                          {(watch("metaTitleAr") || "").length} / 60 حرفاً
                        </span>
                      </div>
                      <Input
                        id="metaTitleAr"
                        placeholder="مثال: ركن العاصي | الأنظمة والحلول الهيدروليكية"
                        {...register("metaTitleAr")}
                      />
                      {errors.metaTitleAr && <p className="text-xs font-semibold text-destructive">{errors.metaTitleAr.message}</p>}
                    </div>

                    {/* Meta Description Ar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="metaDescriptionAr">وصف SEO (بالعربية)</Label>
                        <span className="text-xs font-mono text-muted-foreground">
                          {(watch("metaDescriptionAr") || "").length} / 160 حرفاً
                        </span>
                      </div>
                      <Textarea
                        id="metaDescriptionAr"
                        placeholder="وصف مختصر لمناحك البحث..."
                        className="min-h-[90px]"
                        {...register("metaDescriptionAr")}
                      />
                      {errors.metaDescriptionAr && <p className="text-xs font-semibold text-destructive">{errors.metaDescriptionAr.message}</p>}
                    </div>

                    {/* Keywords Ar */}
                    <div className="space-y-2">
                      <Label htmlFor="keywordsAr">كلمات المفتاحية (بالعربية)</Label>
                      <Input
                        id="keywordsAr"
                        placeholder="أنظمة هيدروليكية، مضخات صناعية، العراق، معدات ثقيلة"
                        {...register("keywordsAr")}
                      />
                    </div>
                  </div>
                }
                kurdishFields={
                  <div className="space-y-4">
                    {/* Meta Title Ku */}
                    <div className="space-y-2">
                      <Label htmlFor="metaTitleKu">نیشانی SEO (بە کوردی)</Label>
                      <Input
                        id="metaTitleKu"
                        placeholder="نموونە: ڕوکن العاصی | چاره‌سه‌ری هایدرۆلیك"
                        {...register("metaTitleKu")}
                      />
                    </div>

                    {/* Meta Description Ku */}
                    <div className="space-y-2">
                      <Label htmlFor="metaDescriptionKu">وەسفی SEO (بە کوردی)</Label>
                      <Textarea
                        id="metaDescriptionKu"
                        placeholder="وەسفی کورت بۆ بەکارهێنەران و گەڕان..."
                        className="min-h-[90px]"
                        {...register("metaDescriptionKu")}
                      />
                    </div>

                    {/* Keywords Ku */}
                    <div className="space-y-2">
                      <Label htmlFor="keywordsKu">وشە کلیلییەکان (بە کوردی)</Label>
                      <Input
                        id="keywordsKu"
                        placeholder="هایدرۆلیک، ئامێری پیشەسازی، عێراق"
                        {...register("keywordsKu")}
                      />
                    </div>
                  </div>
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Controls: Indexing & Open Graph Image */}
        <div className="space-y-6">
          {/* Indexing Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Search Indexing Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                <div className="space-y-0.5">
                  <Label htmlFor="isIndexed" className="text-sm font-bold">
                    Index Page (Search Visible)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Allow Google, Bing, and search engines to index this page.
                  </p>
                </div>
                <Switch
                  id="isIndexed"
                  checked={watch("isIndexed")}
                  onCheckedChange={(checked) => setValue("isIndexed", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Open Graph Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Open Graph Image (Social Share)
              </CardTitle>
              <CardDescription>
                Image displayed when sharing this page on WhatsApp, Facebook, or LinkedIn (recommended 1200x630px).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader
                value={watch("ogImageUrl") ?? null}
                onChange={(url) => setValue("ogImageUrl", url)}
                bucket="branding"
                folder="og-images"
                label="Upload OG Share Image"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
