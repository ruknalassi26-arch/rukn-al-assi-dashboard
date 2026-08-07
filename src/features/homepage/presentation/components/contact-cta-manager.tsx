"use client";
// ==============================================================================
// features/homepage/presentation/components/contact-cta-manager.tsx
// Management form for Homepage Contact CTA Banner with Bilingual Tabs
// ==============================================================================
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, MessageSquare } from "lucide-react";
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
  Skeleton,
} from "@shared/ui";
import { MultilingualTabs } from "@shared/components/multilingual-tabs";
import { ImageUploader } from "@shared/upload/image-uploader";
import { useContactCta, useUpdateContactCta } from "@shared/hooks/homepage/use-homepage-hooks";
import { ErrorState } from "@shared/components/error-state";

const ctaSchema = z.object({
  headingEn: z.string().min(2, "English heading is required"),
  headingAr: z.string().min(2, "Arabic heading is required"),
  headingKu: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  descriptionKu: z.string().optional().nullable(),
  buttonTextEn: z.string().optional().nullable(),
  buttonTextAr: z.string().optional().nullable(),
  buttonTextKu: z.string().optional().nullable(),
  buttonUrl: z.string().optional().nullable(),
  backgroundImage: z.string().optional().nullable(),
});

type CtaFormValues = z.infer<typeof ctaSchema>;

export function ContactCtaManager() {
  const { data: ctaData, isLoading, error, refetch } = useContactCta();
  const updateMutation = useUpdateContactCta();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CtaFormValues>({
    resolver: zodResolver(ctaSchema),
    defaultValues: {
      headingEn: "Ready to Partner With Us?",
      headingAr: "جاهز للشراكة معنا؟",
      headingKu: "",
      descriptionEn: "Request a custom industrial quote or speak directly with our engineering advisory team.",
      descriptionAr: "اطلب عرض سعر صناعي مخصص أو تحدث مباشرة مع فريقنا الاستشاري الهندسي.",
      descriptionKu: "",
      buttonTextEn: "Request a Quote",
      buttonTextAr: "طلب عرض سعر",
      buttonTextKu: "",
      buttonUrl: "/contact",
      backgroundImage: null,
    },
  });

  useEffect(() => {
    if (ctaData) {
      reset({
        headingEn: ctaData.headingEn,
        headingAr: ctaData.headingAr,
        headingKu: (ctaData as any).headingKu ?? "",
        descriptionEn: ctaData.descriptionEn ?? "",
        descriptionAr: ctaData.descriptionAr ?? "",
        descriptionKu: (ctaData as any).descriptionKu ?? "",
        buttonTextEn: ctaData.buttonTextEn ?? "",
        buttonTextAr: ctaData.buttonTextAr ?? "",
        buttonTextKu: (ctaData as any).buttonTextKu ?? "",
        buttonUrl: ctaData.buttonUrl ?? "",
        backgroundImage: ctaData.backgroundImage,
      });
    }
  }, [ctaData, reset]);

  const backgroundImage = watch("backgroundImage");

  const onSubmit = async (values: CtaFormValues) => {
    await updateMutation.mutateAsync(values as any);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
        <CardContent className="space-y-4"><Skeleton className="h-48 w-full" /></CardContent>
      </Card>
    );
  }

  if (error) {
    return <ErrorState title="Failed to load Contact CTA section" error={error} onRetry={() => refetch()} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-rose-600" />
              <CardTitle>Contact CTA Banner</CardTitle>
            </div>
            <CardDescription>
              Configure the call-to-action banner displayed at the bottom of the homepage.
            </CardDescription>
          </div>
          <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save CTA Banner
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <ImageUploader
            label="Banner Background Image"
            value={backgroundImage ?? null}
            onChange={(url) => setValue("backgroundImage", url)}
            folder="cta"
          />

          <MultilingualTabs
            englishFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="headingEn">Heading Title (English) *</Label>
                  <Input id="headingEn" {...register("headingEn")} />
                  {errors.headingEn && <span className="text-xs text-destructive">{errors.headingEn.message}</span>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="descriptionEn">Description Text (English)</Label>
                  <Textarea id="descriptionEn" rows={3} {...register("descriptionEn")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="buttonTextEn">Button Text (English)</Label>
                  <Input id="buttonTextEn" {...register("buttonTextEn")} />
                </div>
              </div>
            }
            arabicFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="headingAr">العنوان (بالعربية) *</Label>
                  <Input id="headingAr" dir="rtl" {...register("headingAr")} />
                  {errors.headingAr && <span className="text-xs text-destructive">{errors.headingAr.message}</span>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="descriptionAr">نص الوصف (بالعربية)</Label>
                  <Textarea id="descriptionAr" rows={3} dir="rtl" {...register("descriptionAr")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="buttonTextAr">نص الزر (بالعربية)</Label>
                  <Input id="buttonTextAr" dir="rtl" {...register("buttonTextAr")} />
                </div>
              </div>
            }
            kurdishFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="headingKu">Heading Title (Kurdish)</Label>
                  <Input id="headingKu" dir="rtl" {...register("headingKu")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="descriptionKu">Description Text (Kurdish)</Label>
                  <Textarea id="descriptionKu" rows={3} dir="rtl" {...register("descriptionKu")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="buttonTextKu">Button Text (Kurdish)</Label>
                  <Input id="buttonTextKu" dir="rtl" {...register("buttonTextKu")} />
                </div>
              </div>
            }
          />

          <div className="space-y-1.5 pt-2 border-t">
            <Label htmlFor="buttonUrl">Button Link URL</Label>
            <Input id="buttonUrl" {...register("buttonUrl")} placeholder="/contact" />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
