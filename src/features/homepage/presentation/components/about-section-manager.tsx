"use client";
// ==============================================================================
// features/homepage/presentation/components/about-section-manager.tsx
// Management form for Homepage About Preview Section with Bilingual Tabs
// ==============================================================================
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, Plus, Trash2, FileText } from "lucide-react";
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
  Skeleton,
} from "@shared/ui";
import { BilingualTabs } from "@shared/components/bilingual-tabs";
import { ImageUploader } from "@shared/upload/image-uploader";
import { useAboutPreview, useUpdateAboutPreview } from "@shared/hooks/homepage/use-homepage-hooks";
import { ErrorState } from "@shared/components/error-state";

const aboutSchema = z.object({
  titleEn: z.string().min(2, "English title is required"),
  titleAr: z.string().min(2, "Arabic title is required"),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  buttonTextEn: z.string().optional().nullable(),
  buttonTextAr: z.string().optional().nullable(),
  buttonUrl: z.string().optional().nullable(),
  highlightsEn: z.array(z.object({ value: z.string() })),
  highlightsAr: z.array(z.object({ value: z.string() })),
  status: z.enum(["active", "draft"]),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

export function AboutSectionManager() {
  const { data: aboutData, isLoading, error, refetch } = useAboutPreview();
  const updateMutation = useUpdateAboutPreview();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      titleEn: "",
      titleAr: "",
      descriptionEn: "",
      descriptionAr: "",
      imageUrl: null,
      buttonTextEn: "Learn More About Us",
      buttonTextAr: "اقرأ المزيد عنا",
      buttonUrl: "/about",
      highlightsEn: [{ value: "ISO 9001 Certified Quality Standards" }],
      highlightsAr: [{ value: "معايير جودة معتمدة بشهادة الآيزو" }],
      status: "active",
    },
  });

  const {
    fields: highlightsEnFields,
    append: appendEn,
    remove: removeEn,
  } = useFieldArray({ control, name: "highlightsEn" });

  const {
    fields: highlightsArFields,
    append: appendAr,
    remove: removeAr,
  } = useFieldArray({ control, name: "highlightsAr" });

  useEffect(() => {
    if (aboutData) {
      reset({
        titleEn: aboutData.titleEn,
        titleAr: aboutData.titleAr,
        descriptionEn: aboutData.descriptionEn ?? "",
        descriptionAr: aboutData.descriptionAr ?? "",
        imageUrl: aboutData.imageUrl,
        buttonTextEn: aboutData.buttonTextEn ?? "",
        buttonTextAr: aboutData.buttonTextAr ?? "",
        buttonUrl: aboutData.buttonUrl ?? "",
        highlightsEn: (aboutData.highlightsEn ?? []).map((val) => ({ value: val })),
        highlightsAr: (aboutData.highlightsAr ?? []).map((val) => ({ value: val })),
        status: aboutData.status,
      });
    }
  }, [aboutData, reset]);

  const imageUrl = watch("imageUrl");
  const status = watch("status");

  const onSubmit = async (values: AboutFormValues) => {
    await updateMutation.mutateAsync({
      ...values,
      highlightsEn: values.highlightsEn.map((h) => h.value).filter(Boolean),
      highlightsAr: values.highlightsAr.map((h) => h.value).filter(Boolean),
    });
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
    return <ErrorState title="Failed to load About section" error={error} onRetry={() => refetch()} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              <CardTitle>About Section Preview</CardTitle>
            </div>
            <CardDescription>
              Configure the company introduction snippet and highlight points shown on the homepage.
            </CardDescription>
          </div>
          <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save About Section
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <ImageUploader
            label="Section Feature Image"
            value={imageUrl ?? null}
            onChange={(url) => setValue("imageUrl", url)}
            folder="about"
          />

          <BilingualTabs
            englishFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="titleEn">Section Heading (English) *</Label>
                  <Input id="titleEn" {...register("titleEn")} />
                  {errors.titleEn && <span className="text-xs text-destructive">{errors.titleEn.message}</span>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="descriptionEn">Description Paragraph (English)</Label>
                  <Textarea id="descriptionEn" rows={4} {...register("descriptionEn")} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="buttonTextEn">Button Text (English)</Label>
                    <Input id="buttonTextEn" {...register("buttonTextEn")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="buttonUrl">Button Link URL</Label>
                    <Input id="buttonUrl" {...register("buttonUrl")} />
                  </div>
                </div>

                <div className="space-y-2 border p-3 rounded-lg bg-muted/10">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Key Highlights (English)</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendEn({ value: "" })} className="gap-1 text-xs">
                      <Plus className="h-3 w-3" /> Add Highlight
                    </Button>
                  </div>
                  {highlightsEnFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input {...register(`highlightsEn.${index}.value`)} placeholder="e.g. 15+ Years Industrial Experience" className="text-xs" />
                      <Button type="button" variant="destructive" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeEn(index)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            }
            arabicFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="titleAr">عنوان القسم (بالعربية) *</Label>
                  <Input id="titleAr" dir="rtl" {...register("titleAr")} />
                  {errors.titleAr && <span className="text-xs text-destructive">{errors.titleAr.message}</span>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="descriptionAr">نص الوصف (بالعربية)</Label>
                  <Textarea id="descriptionAr" rows={4} dir="rtl" {...register("descriptionAr")} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="buttonTextAr">نص الزر (بالعربية)</Label>
                    <Input id="buttonTextAr" dir="rtl" {...register("buttonTextAr")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="buttonUrlAr">رابط الزر</Label>
                    <Input id="buttonUrlAr" {...register("buttonUrl")} />
                  </div>
                </div>

                <div className="space-y-2 border p-3 rounded-lg bg-muted/10">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">أبرز النقاط المميزة (بالعربية)</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendAr({ value: "" })} className="gap-1 text-xs">
                      <Plus className="h-3 w-3" /> إضافة نقطة
                    </Button>
                  </div>
                  {highlightsArFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input dir="rtl" {...register(`highlightsAr.${index}.value`)} placeholder="مثال: خبرة تزيد عن 15 عاماً" className="text-xs" />
                      <Button type="button" variant="destructive" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeAr(index)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            }
          />

          <div className="space-y-1.5 pt-2 border-t">
            <Label>Status</Label>
            <Select value={status} onValueChange={(val: "active" | "draft") => setValue("status", val)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
