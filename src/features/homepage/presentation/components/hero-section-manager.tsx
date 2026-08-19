"use client";
// ==============================================================================
// features/homepage/presentation/components/hero-section-manager.tsx
// Comprehensive single-section Hero Editor matching database structure
// Fully internationalized (EN, AR, CKB) with trilingual tabs and live preview.
// ==============================================================================
import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Video,
  Image as ImageIcon,
  Save,
  Loader2,
  Eye,
  Sliders,
  Sparkles,
  Link as LinkIcon,
  Monitor,
  Smartphone,
  CheckCircle2,
  Film,
  Layers,
  Globe2,
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
  Switch,
  Badge,
  Skeleton,
} from "@shared/ui";
import { MultilingualTabs } from "@shared/components/multilingual-tabs";
import { ImageUploader } from "@shared/upload/image-uploader";
import { VideoUploader } from "@shared/upload/video-uploader";
import { ErrorState } from "@shared/components/error-state";
import { useHeroSection, useUpdateHeroSection } from "../hooks/use-homepage-hero";
import { usePermission } from "@features/roles-permissions/presentation/hooks/use-permission";
import { toast } from "@core/utils/toast";

const heroSchema = z.object({
  mediaType: z.enum(["video", "image"]),
  videoUrl: z.string().optional().nullable(),
  videoPosterUrl: z.string().optional().nullable(),
  videoMobileUrl: z.string().optional().nullable(),
  overlayOpacity: z.number().min(0).max(100),
  titleEn: z.string().min(2, "English title is required"),
  titleAr: z.string().min(2, "Arabic title is required"),
  titleKu: z.string().optional().nullable(),
  subtitleEn: z.string().optional().nullable(),
  subtitleAr: z.string().optional().nullable(),
  subtitleKu: z.string().optional().nullable(),
  bodyEn: z.string().optional().nullable(),
  bodyAr: z.string().optional().nullable(),
  bodyKu: z.string().optional().nullable(),
  primaryButtonTextEn: z.string().optional().nullable(),
  primaryButtonTextAr: z.string().optional().nullable(),
  primaryButtonTextKu: z.string().optional().nullable(),
  primaryButtonUrl: z.string().optional().nullable(),
  secondaryButtonTextEn: z.string().optional().nullable(),
  secondaryButtonTextAr: z.string().optional().nullable(),
  secondaryButtonTextKu: z.string().optional().nullable(),
  secondaryButtonUrl: z.string().optional().nullable(),
  isVisible: z.boolean(),
});

type HeroFormValues = z.infer<typeof heroSchema>;

export function HeroSectionManager() {
  const t = useTranslations("homepageAdmin.hero");
  const { hasPermission } = usePermission();
  const canManage = hasPermission("homepage", "manage") || hasPermission("homepage", "edit");

  const { data: heroData, isLoading, error, refetch } = useHeroSection();
  const updateMutation = useUpdateHeroSection();

  const [previewLanguage, setPreviewLanguage] = useState<"en" | "ar" | "ku">("en");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [videoLoadError, setVideoLoadError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      mediaType: "video",
      videoUrl: "",
      videoPosterUrl: "",
      videoMobileUrl: "",
      overlayOpacity: 40,
      titleEn: "",
      titleAr: "",
      titleKu: "",
      subtitleEn: "",
      subtitleAr: "",
      subtitleKu: "",
      bodyEn: "",
      bodyAr: "",
      bodyKu: "",
      primaryButtonTextEn: "",
      primaryButtonTextAr: "",
      primaryButtonTextKu: "",
      primaryButtonUrl: "",
      secondaryButtonTextEn: "",
      secondaryButtonTextAr: "",
      secondaryButtonTextKu: "",
      secondaryButtonUrl: "",
      isVisible: true,
    },
  });

  // Populate form when data loads
  useEffect(() => {
    if (heroData) {
      reset({
        mediaType: heroData.mediaType || "video",
        videoUrl: heroData.videoUrl || "",
        videoPosterUrl: heroData.videoPosterUrl || "",
        videoMobileUrl: heroData.videoMobileUrl || "",
        overlayOpacity: heroData.overlayOpacity ?? 40,
        titleEn: heroData.titleEn || "",
        titleAr: heroData.titleAr || "",
        titleKu: heroData.titleKu || "",
        subtitleEn: heroData.subtitleEn || "",
        subtitleAr: heroData.subtitleAr || "",
        subtitleKu: heroData.subtitleKu || "",
        bodyEn: heroData.bodyEn || "",
        bodyAr: heroData.bodyAr || "",
        bodyKu: heroData.bodyKu || "",
        primaryButtonTextEn: heroData.primaryButtonTextEn || "",
        primaryButtonTextAr: heroData.primaryButtonTextAr || "",
        primaryButtonTextKu: heroData.primaryButtonTextKu || "",
        primaryButtonUrl: heroData.primaryButtonUrl || "",
        secondaryButtonTextEn: heroData.secondaryButtonTextEn || "",
        secondaryButtonTextAr: heroData.secondaryButtonTextAr || "",
        secondaryButtonTextKu: heroData.secondaryButtonTextKu || "",
        secondaryButtonUrl: heroData.secondaryButtonUrl || "",
        isVisible: heroData.isVisible,
      });
      setVideoLoadError(false);
    }
  }, [heroData, reset]);

  // Watched values for dynamic UI and live preview
  const watchedMediaType = watch("mediaType");
  const watchedVideoUrl = watch("videoUrl");
  const watchedPosterUrl = watch("videoPosterUrl");
  const watchedMobileVideoUrl = watch("videoMobileUrl");
  const watchedOverlayOpacity = watch("overlayOpacity");
  const watchedIsVisible = watch("isVisible");

  const watchedTitleEn = watch("titleEn");
  const watchedTitleAr = watch("titleAr");
  const watchedTitleKu = watch("titleKu");

  const watchedSubtitleEn = watch("subtitleEn");
  const watchedSubtitleAr = watch("subtitleAr");
  const watchedSubtitleKu = watch("subtitleKu");

  const watchedBodyEn = watch("bodyEn");
  const watchedBodyAr = watch("bodyAr");
  const watchedBodyKu = watch("bodyKu");

  const watchedPrimaryTextEn = watch("primaryButtonTextEn");
  const watchedPrimaryTextAr = watch("primaryButtonTextAr");
  const watchedPrimaryTextKu = watch("primaryButtonTextKu");

  const watchedSecondaryTextEn = watch("secondaryButtonTextEn");
  const watchedSecondaryTextAr = watch("secondaryButtonTextAr");
  const watchedSecondaryTextKu = watch("secondaryButtonTextKu");

  // Reset video load error when URL or preview device changes
  useEffect(() => {
    setVideoLoadError(false);
  }, [watchedVideoUrl, watchedMobileVideoUrl, previewDevice]);

  const onSubmit = async (values: HeroFormValues) => {
    try {
      await updateMutation.mutateAsync({
        mediaType: values.mediaType,
        videoUrl: values.videoUrl?.trim() || null,
        videoPosterUrl: values.videoPosterUrl?.trim() || null,
        videoMobileUrl: values.videoMobileUrl?.trim() || null,
        overlayOpacity: Number(values.overlayOpacity),
        titleEn: values.titleEn,
        titleAr: values.titleAr,
        titleKu: values.titleKu?.trim() || null,
        subtitleEn: values.subtitleEn?.trim() || null,
        subtitleAr: values.subtitleAr?.trim() || null,
        subtitleKu: values.subtitleKu?.trim() || null,
        bodyEn: values.bodyEn?.trim() || null,
        bodyAr: values.bodyAr?.trim() || null,
        bodyKu: values.bodyKu?.trim() || null,
        primaryButtonTextEn: values.primaryButtonTextEn?.trim() || null,
        primaryButtonTextAr: values.primaryButtonTextAr?.trim() || null,
        primaryButtonTextKu: values.primaryButtonTextKu?.trim() || null,
        primaryButtonUrl: values.primaryButtonUrl?.trim() || null,
        secondaryButtonTextEn: values.secondaryButtonTextEn?.trim() || null,
        secondaryButtonTextAr: values.secondaryButtonTextAr?.trim() || null,
        secondaryButtonTextKu: values.secondaryButtonTextKu?.trim() || null,
        secondaryButtonUrl: values.secondaryButtonUrl?.trim() || null,
        isVisible: values.isVisible,
      });
      toast.success(t("saveSuccess"));
    } catch {
      toast.error(t("saveError"));
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-36" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-72 w-full rounded-xl" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title={t("failedToLoad")}
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  // Determine active preview texts based on previewLanguage
  const activeTitle =
    previewLanguage === "en"
      ? watchedTitleEn || "Engineering & Industrial Hydraulic Solutions"
      : previewLanguage === "ar"
      ? watchedTitleAr || "حلول الهيدروليك والهندسة الصناعية"
      : watchedTitleKu || "چارەسەرەکانی هایدرۆلیکی و ئەندازیاری پیشەسازی";

  const activeSubtitle =
    previewLanguage === "en"
      ? watchedSubtitleEn
      : previewLanguage === "ar"
      ? watchedSubtitleAr
      : watchedSubtitleKu;

  const activeBody =
    previewLanguage === "en"
      ? watchedBodyEn
      : previewLanguage === "ar"
      ? watchedBodyAr
      : watchedBodyKu;

  const activePrimaryText =
    previewLanguage === "en"
      ? watchedPrimaryTextEn
      : previewLanguage === "ar"
      ? watchedPrimaryTextAr
      : watchedPrimaryTextKu;

  const activeSecondaryText =
    previewLanguage === "en"
      ? watchedSecondaryTextEn
      : previewLanguage === "ar"
      ? watchedSecondaryTextAr
      : watchedSecondaryTextKu;

  const isRtlPreview = previewLanguage === "ar" || previewLanguage === "ku";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border bg-card/60 backdrop-blur-sm shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
            <Film className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground tracking-tight">{t("title")}</h2>
              <Badge variant={watchedIsVisible ? "default" : "secondary"}>
                {watchedIsVisible ? t("badgeVisible") : t("badgeHidden")}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-muted/40 text-xs">
            <Label htmlFor="hero-visibility" className="text-xs font-medium cursor-pointer">
              {t("visibility")}
            </Label>
            <Switch
              id="hero-visibility"
              checked={watchedIsVisible}
              onCheckedChange={(checked) => setValue("isVisible", checked, { shouldDirty: true })}
              disabled={!canManage}
            />
          </div>

          <Button
            type="submit"
            disabled={!canManage || updateMutation.isPending}
            className="gap-2 shadow-xs min-w-[130px]"
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {updateMutation.isPending ? t("saving") : t("saveChanges")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Media Configuration */}
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-base">{t("mediaCardTitle")}</CardTitle>
              </div>
              <CardDescription>
                {t("mediaCardDesc")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Media Type Selector */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("mediaType")}
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setValue("mediaType", "video", { shouldDirty: true })}
                    className={`flex items-center justify-center gap-2.5 p-3 rounded-lg border text-sm font-medium transition-all ${
                      watchedMediaType === "video"
                        ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 shadow-xs"
                        : "border-border/60 hover:bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <Video className="h-4 w-4" />
                    <span>{t("backgroundVideo")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setValue("mediaType", "image", { shouldDirty: true })}
                    className={`flex items-center justify-center gap-2.5 p-3 rounded-lg border text-sm font-medium transition-all ${
                      watchedMediaType === "image"
                        ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 shadow-xs"
                        : "border-border/60 hover:bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>{t("staticImage")}</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Media Fields */}
              {watchedMediaType === "video" ? (
                <div className="space-y-5 pt-2 border-t border-border/40">
                  {/* Main Desktop / Hero Background Video */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold flex items-center justify-between">
                      <span>{t("desktopVideo")}</span>
                      <span className="text-[11px] font-normal text-muted-foreground">{t("desktopVideoHint")}</span>
                    </Label>
                    <VideoUploader
                      value={watchedVideoUrl || null}
                      onChange={(url) => setValue("videoUrl", url, { shouldDirty: true })}
                      bucket="branding"
                      folder="hero-videos"
                      description={t("desktopVideoDesc")}
                      maxSizeMB={50}
                      disabled={!canManage}
                    />
                  </div>

                  {/* Video Poster / Fallback Image */}
                  <div className="space-y-1.5">
                    <Label htmlFor="videoPosterUrl" className="text-xs font-semibold flex items-center justify-between">
                      <span>{t("videoPoster")}</span>
                      <span className="text-[11px] font-normal text-muted-foreground">{t("videoPosterHint")}</span>
                    </Label>
                    <ImageUploader
                      value={watchedPosterUrl || null}
                      onChange={(url) => setValue("videoPosterUrl", url, { shouldDirty: true })}
                      bucket="branding"
                      folder="hero-images"
                      hintText={t("videoPosterPlaceholder")}
                      maxSizeMB={50}
                    />
                  </div>

                  {/* Mobile Video */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold flex items-center justify-between">
                      <span>{t("mobileVideo")}</span>
                      <span className="text-[11px] font-normal text-muted-foreground">{t("mobileVideoHint")}</span>
                    </Label>
                    <VideoUploader
                      value={watchedMobileVideoUrl || null}
                      onChange={(url) => setValue("videoMobileUrl", url, { shouldDirty: true })}
                      bucket="branding"
                      folder="hero-videos"
                      description={t("mobileVideoDesc")}
                      maxSizeMB={50}
                      disabled={!canManage}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-2 border-t border-border/40">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold flex items-center justify-between">
                      <span>{t("heroBannerImage")}</span>
                      <span className="text-[11px] font-normal text-muted-foreground">{t("heroBannerImageHint")}</span>
                    </Label>
                    <ImageUploader
                      value={watchedPosterUrl || null}
                      onChange={(url) => setValue("videoPosterUrl", url, { shouldDirty: true })}
                      bucket="branding"
                      folder="hero-images"
                      hintText={t("heroBannerImageDesc")}
                      maxSizeMB={50}
                    />
                  </div>
                </div>
              )}

              {/* Overlay Opacity Slider */}
              <div className="space-y-2 pt-3 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <Label htmlFor="overlay-opacity-range" className="text-xs font-semibold flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{t("overlayOpacity")}</span>
                  </Label>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-muted font-mono">
                    {watchedOverlayOpacity}%
                  </span>
                </div>
                <input
                  id="overlay-opacity-range"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={watchedOverlayOpacity ?? 40}
                  onChange={(e) => setValue("overlayOpacity", Number(e.target.value), { shouldDirty: true })}
                  disabled={!canManage}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                />
                <p className="text-[11px] text-muted-foreground">
                  {t("overlayOpacityDesc")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Trilingual Content */}
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-emerald-600" />
                <CardTitle className="text-base">{t("contentCardTitle")}</CardTitle>
              </div>
              <CardDescription>
                {t("contentCardDesc")}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <MultilingualTabs
                defaultLanguage="en"
                englishFields={
                  <div className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                      <Label htmlFor="titleEn" className="text-xs font-semibold">
                        {t("mainTitle")} (English) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="titleEn"
                        placeholder={t("mainTitlePlaceholder")}
                        {...register("titleEn")}
                        disabled={!canManage}
                        className={errors.titleEn ? "border-red-500" : ""}
                      />
                      {errors.titleEn && (
                        <p className="text-xs text-red-500">{errors.titleEn.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="subtitleEn" className="text-xs font-semibold">
                        {t("subtitle")} (English)
                      </Label>
                      <Input
                        id="subtitleEn"
                        placeholder={t("subtitlePlaceholder")}
                        {...register("subtitleEn")}
                        disabled={!canManage}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="bodyEn" className="text-xs font-semibold">
                        {t("body")} (English)
                      </Label>
                      <Textarea
                        id="bodyEn"
                        rows={3}
                        placeholder={t("bodyPlaceholder")}
                        {...register("bodyEn")}
                        disabled={!canManage}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="primaryButtonTextEn" className="text-xs font-semibold">
                          {t("primaryBtnLabel")} (EN)
                        </Label>
                        <Input
                          id="primaryButtonTextEn"
                          placeholder={t("primaryBtnLabelPlaceholder")}
                          {...register("primaryButtonTextEn")}
                          disabled={!canManage}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="secondaryButtonTextEn" className="text-xs font-semibold">
                          {t("secondaryBtnLabel")} (EN)
                        </Label>
                        <Input
                          id="secondaryButtonTextEn"
                          placeholder={t("secondaryBtnLabelPlaceholder")}
                          {...register("secondaryButtonTextEn")}
                          disabled={!canManage}
                        />
                      </div>
                    </div>
                  </div>
                }
                arabicFields={
                  <div className="space-y-4 pt-1" dir="rtl">
                    <div className="space-y-1.5 text-right">
                      <Label htmlFor="titleAr" className="text-xs font-semibold">
                        {t("mainTitle")} (العربية) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="titleAr"
                        placeholder="مثال: حلول الهيدروليك والهندسة الصناعية"
                        {...register("titleAr")}
                        disabled={!canManage}
                        dir="rtl"
                        className={errors.titleAr ? "border-red-500 text-right" : "text-right"}
                      />
                      {errors.titleAr && (
                        <p className="text-xs text-red-500 text-right">{errors.titleAr.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5 text-right">
                      <Label htmlFor="subtitleAr" className="text-xs font-semibold">
                        {t("subtitle")} (العربية)
                      </Label>
                      <Input
                        id="subtitleAr"
                        placeholder="مثال: المزود الرائد لمعدات الهيدروليك وقطع الغيار في العراق"
                        {...register("subtitleAr")}
                        disabled={!canManage}
                        dir="rtl"
                        className="text-right"
                      />
                    </div>

                    <div className="space-y-1.5 text-right">
                      <Label htmlFor="bodyAr" className="text-xs font-semibold">
                        {t("body")} (العربية)
                      </Label>
                      <Textarea
                        id="bodyAr"
                        rows={3}
                        placeholder="مثال: نقدم أحدث الآلات والمعدات الهيدروليكية الثقيلة، والاسطوانات، والمضخات، وحلول الأتمتة المتقدمة."
                        {...register("bodyAr")}
                        disabled={!canManage}
                        dir="rtl"
                        className="text-right"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5 text-right">
                        <Label htmlFor="primaryButtonTextAr" className="text-xs font-semibold">
                          {t("primaryBtnLabel")} (العربية)
                        </Label>
                        <Input
                          id="primaryButtonTextAr"
                          placeholder="مثال: استكشف المنتجات"
                          {...register("primaryButtonTextAr")}
                          disabled={!canManage}
                          dir="rtl"
                          className="text-right"
                        />
                      </div>

                      <div className="space-y-1.5 text-right">
                        <Label htmlFor="secondaryButtonTextAr" className="text-xs font-semibold">
                          {t("secondaryBtnLabel")} (العربية)
                        </Label>
                        <Input
                          id="secondaryButtonTextAr"
                          placeholder="مثال: اتصل بنا"
                          {...register("secondaryButtonTextAr")}
                          disabled={!canManage}
                          dir="rtl"
                          className="text-right"
                        />
                      </div>
                    </div>
                  </div>
                }
                kurdishFields={
                  <div className="space-y-4 pt-1" dir="rtl">
                    <div className="space-y-1.5 text-right">
                      <Label htmlFor="titleKu" className="text-xs font-semibold">
                        {t("mainTitle")} (کوردی)
                      </Label>
                      <Input
                        id="titleKu"
                        placeholder="نموونە: چارەسەرەکانی هایدرۆلیکی و ئەندازیاری پیشەسازی"
                        {...register("titleKu")}
                        disabled={!canManage}
                        dir="rtl"
                        className="text-right"
                      />
                    </div>

                    <div className="space-y-1.5 text-right">
                      <Label htmlFor="subtitleKu" className="text-xs font-semibold">
                        {t("subtitle")} (کوردی)
                      </Label>
                      <Input
                        id="subtitleKu"
                        placeholder="نموونە: پێشەنگ لە دابینکردنی کەرەستە و پارچەی یەدەگی هایدرۆلیکی لە عێراق"
                        {...register("subtitleKu")}
                        disabled={!canManage}
                        dir="rtl"
                        className="text-right"
                      />
                    </div>

                    <div className="space-y-1.5 text-right">
                      <Label htmlFor="bodyKu" className="text-xs font-semibold">
                        {t("body")} (کوردی)
                      </Label>
                      <Textarea
                        id="bodyKu"
                        rows={3}
                        placeholder="نموونە: پێشکەشکردنی ئامێر و کەرەستەی پیشەسازی قورس و سلندەر و پەمپ و ڤاڵڤ و سیستەمی ئۆتۆمەیشنی پێشکەوتوو."
                        {...register("bodyKu")}
                        disabled={!canManage}
                        dir="rtl"
                        className="text-right"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5 text-right">
                        <Label htmlFor="primaryButtonTextKu" className="text-xs font-semibold">
                          {t("primaryBtnLabel")} (کوردی)
                        </Label>
                        <Input
                          id="primaryButtonTextKu"
                          placeholder="نموونە: بڕوانە بەرهەمەکان"
                          {...register("primaryButtonTextKu")}
                          disabled={!canManage}
                          dir="rtl"
                          className="text-right"
                        />
                      </div>

                      <div className="space-y-1.5 text-right">
                        <Label htmlFor="secondaryButtonTextKu" className="text-xs font-semibold">
                          {t("secondaryBtnLabel")} (کوردی)
                        </Label>
                        <Input
                          id="secondaryButtonTextKu"
                          placeholder="نموونە: پەیوەندیمان پێوە بکە"
                          {...register("secondaryButtonTextKu")}
                          disabled={!canManage}
                          dir="rtl"
                          className="text-right"
                        />
                      </div>
                    </div>
                  </div>
                }
              />
            </CardContent>
          </Card>

          {/* Card 3: Action Links / Destination URLs */}
          <Card className="border-border/60 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-cyan-600" />
                <CardTitle className="text-base">{t("ctaCardTitle")}</CardTitle>
              </div>
              <CardDescription>
                {t("ctaCardDesc")}
              </CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="primaryButtonUrl" className="text-xs font-semibold">
                  {t("primaryBtnUrl")}
                </Label>
                <Input
                  id="primaryButtonUrl"
                  placeholder={t("primaryBtnUrlPlaceholder")}
                  {...register("primaryButtonUrl")}
                  disabled={!canManage}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="secondaryButtonUrl" className="text-xs font-semibold">
                  {t("secondaryBtnUrl")}
                </Label>
                <Input
                  id="secondaryButtonUrl"
                  placeholder={t("secondaryBtnUrlPlaceholder")}
                  {...register("secondaryButtonUrl")}
                  disabled={!canManage}
                  className="font-mono text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Responsive Preview (5 cols, sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
          <Card className="border-border/60 shadow-md overflow-hidden bg-card">
            <CardHeader className="p-4 pb-3 border-b bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <CardTitle className="text-sm font-semibold">{t("previewCardTitle")}</CardTitle>
                </div>

                {/* Device & Language Switchers */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded-md p-0.5 bg-background">
                    <button
                      type="button"
                      onClick={() => setPreviewLanguage("en")}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                        previewLanguage === "en" ? "bg-blue-600 text-white" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewLanguage("ar")}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                        previewLanguage === "ar" ? "bg-blue-600 text-white" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      عربي
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewLanguage("ku")}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                        previewLanguage === "ku" ? "bg-blue-600 text-white" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      کوردی
                    </button>
                  </div>

                  <div className="flex items-center border rounded-md p-0.5 bg-background">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("desktop")}
                      className={`p-1 rounded transition-all ${
                        previewDevice === "desktop" ? "bg-muted text-foreground" : "text-muted-foreground"
                      }`}
                      title={t("previewDesktop")}
                    >
                      <Monitor className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("mobile")}
                      className={`p-1 rounded transition-all ${
                        previewDevice === "mobile" ? "bg-muted text-foreground" : "text-muted-foreground"
                      }`}
                      title={t("previewMobile")}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 flex flex-col items-center justify-center bg-slate-950/5 dark:bg-black/40">
              {/* Preview Container Frame */}
              <div
                className={`relative rounded-xl overflow-hidden border border-border/80 shadow-xl transition-all duration-300 ${
                  previewDevice === "desktop"
                    ? "w-full aspect-[16/10] min-h-[360px]"
                    : "w-[240px] aspect-[9/16] min-h-[420px]"
                }`}
              >
                {/* Media Layer */}
                <div className="absolute inset-0 bg-slate-900 overflow-hidden flex items-center justify-center">
                  {watchedMediaType === "video" && (previewDevice === "mobile" ? (watchedMobileVideoUrl || watchedVideoUrl) : watchedVideoUrl) && !videoLoadError ? (
                    <video
                      ref={videoRef}
                      key={previewDevice === "mobile" && watchedMobileVideoUrl ? watchedMobileVideoUrl : watchedVideoUrl}
                      src={
                        (previewDevice === "mobile" && watchedMobileVideoUrl
                          ? watchedMobileVideoUrl
                          : watchedVideoUrl) || ""
                      }
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster={watchedPosterUrl || undefined}
                      onError={() => setVideoLoadError(true)}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : watchedPosterUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={watchedPosterUrl}
                      alt="Hero banner preview"
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                      <Film className="h-8 w-8 mb-2 opacity-40 animate-pulse" />
                      <span className="text-xs">{t("previewNoMedia")}</span>
                    </div>
                  )}

                  {/* Dark Tint Opacity Overlay */}
                  <div
                    className="absolute inset-0 bg-black transition-opacity duration-150"
                    style={{ opacity: (watchedOverlayOpacity ?? 40) / 100 }}
                  />

                  {/* Gradient Accents */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                </div>

                {/* Content Overlay */}
                <div
                  className={`absolute inset-0 p-5 flex flex-col justify-end text-white pointer-events-none ${
                    isRtlPreview ? "text-right items-end" : "text-left items-start"
                  }`}
                  dir={isRtlPreview ? "rtl" : "ltr"}
                >
                  {/* Subtitle Pill */}
                  {activeSubtitle && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-200 text-[10px] font-medium backdrop-blur-md mb-2 shadow-xs max-w-full truncate">
                      <Sparkles className="h-2.5 w-2.5 shrink-0" />
                      <span className="truncate">{activeSubtitle}</span>
                    </div>
                  )}

                  {/* Headline Title */}
                  <h3
                    className={`font-extrabold text-white leading-tight drop-shadow-md mb-2 ${
                      previewDevice === "desktop" ? "text-base sm:text-lg max-w-[85%]" : "text-xs max-w-full"
                    }`}
                  >
                    {activeTitle}
                  </h3>

                  {/* Body Paragraph */}
                  {activeBody && (
                    <p
                      className={`text-slate-300/90 leading-relaxed drop-shadow line-clamp-3 mb-3 ${
                        previewDevice === "desktop" ? "text-[11px] max-w-[80%]" : "text-[9px]"
                      }`}
                    >
                      {activeBody}
                    </p>
                  )}

                  {/* Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {activePrimaryText && (
                      <div className="px-3 py-1.5 rounded-md bg-blue-600 text-white font-semibold text-[10px] shadow-sm flex items-center gap-1">
                        <span>{activePrimaryText}</span>
                      </div>
                    )}

                    {activeSecondaryText && (
                      <div className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-[10px] backdrop-blur-sm">
                        <span>{activeSecondaryText}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>{t("previewStatus")}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
