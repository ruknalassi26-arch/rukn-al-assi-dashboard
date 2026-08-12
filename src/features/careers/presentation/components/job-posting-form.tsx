"use client";
// ==============================================================================
// features/careers/presentation/components/job-posting-form.tsx
// Job Posting Creation & Edit Form (RHF + Zod + MultilingualTabs)
// ==============================================================================
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { Loader2, Save, ArrowLeft, Briefcase } from "lucide-react";
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
} from "@shared/ui";
import { MultilingualTabs } from "@shared/components/multilingual-tabs";
import { useCreateJobPosting, useUpdateJobPosting } from "@shared/hooks/careers/use-career-hooks";
import type { JobPostingEntity } from "../../domain/entities/career.entity";
import type { EmploymentType, JobPostingStatus } from "../../domain/enums/career.enum";

const postingSchema = z.object({
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and hyphens"),
  titleEn: z.string().min(2, "English title is required"),
  titleAr: z.string().min(2, "Arabic title is required"),
  titleKu: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  descriptionKu: z.string().optional().nullable(),
  requirementsEn: z.string().optional().nullable(),
  requirementsAr: z.string().optional().nullable(),
  requirementsKu: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  employmentType: z.enum(["full_time", "part_time", "contract", "internship"]),
  location: z.string().optional().nullable(),
  closingDate: z.string().optional().nullable(),
  sortOrder: z.number().min(0),
  status: z.enum(["draft", "published", "archived"]),
});

export type JobPostingFormValues = z.infer<typeof postingSchema>;

interface JobPostingFormProps {
  initialData?: JobPostingEntity | null;
}

export function JobPostingForm({ initialData }: JobPostingFormProps) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("careersAdmin");
  const tCommon = useTranslations("common");

  const createMutation = useCreateJobPosting();
  const updateMutation = useUpdateJobPosting();

  const isEditing = !!initialData;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<JobPostingFormValues>({
    resolver: zodResolver(postingSchema),
    defaultValues: {
      slug: "",
      titleEn: "",
      titleAr: "",
      titleKu: "",
      descriptionEn: "",
      descriptionAr: "",
      descriptionKu: "",
      requirementsEn: "",
      requirementsAr: "",
      requirementsKu: "",
      department: "Engineering & Maintenance",
      employmentType: "full_time",
      location: "Riyadh, Saudi Arabia",
      closingDate: "",
      sortOrder: 0,
      status: "published",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        slug: initialData.slug,
        titleEn: initialData.titleEn,
        titleAr: initialData.titleAr ?? "",
        titleKu: initialData.titleKu ?? "",
        descriptionEn: initialData.descriptionEn ?? "",
        descriptionAr: initialData.descriptionAr ?? "",
        descriptionKu: initialData.descriptionKu ?? "",
        requirementsEn: initialData.requirementsEn ?? "",
        requirementsAr: initialData.requirementsAr ?? "",
        requirementsKu: initialData.requirementsKu ?? "",
        department: initialData.department ?? "",
        employmentType: initialData.employmentType ?? "full_time",
        location: initialData.location ?? "",
        closingDate: initialData.closingDate ?? "",
        sortOrder: initialData.sortOrder ?? 0,
        status: initialData.status ?? "draft",
      });
    }
  }, [initialData, reset]);

  const titleEnValue = watch("titleEn");
  const employmentTypeValue = watch("employmentType");
  const statusValue = watch("status");

  // Auto-generate slug from English title
  const handleTitleEnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("titleEn", val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setValue("slug", generatedSlug);
    }
  };

  const onSubmit = async (values: JobPostingFormValues) => {
    if (isEditing && initialData) {
      await updateMutation.mutateAsync({ id: initialData.id, data: values });
    } else {
      await createMutation.mutateAsync(values);
    }
    router.push(`/${locale}/admin/careers/postings`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.push(`/${locale}/admin/careers/postings`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditing ? t("editPosting") : t("addPosting")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEditing ? `Editing position: ${initialData?.titleEn}` : "Fill out position details and publishing rules."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/${locale}/admin/careers/postings`)}
            disabled={isPending}
          >
            {tCommon("cancel")}
          </Button>
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEditing ? tCommon("save") : t("form.savePosting")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Multilingual Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-600" />
                {t("detailsTitle")}
              </CardTitle>
              <CardDescription>
                {t("detailsSubtitle")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <MultilingualTabs
                englishFields={
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="titleEn">{t("form.positionTitle")} (English) *</Label>
                      <Input
                        id="titleEn"
                        {...register("titleEn")}
                        onChange={handleTitleEnChange}
                        placeholder="e.g. Senior Hydraulic Systems Engineer"
                      />
                      {errors.titleEn && <span className="text-xs text-destructive">{errors.titleEn.message}</span>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="descriptionEn">{t("form.description")} (English)</Label>
                      <Textarea
                        id="descriptionEn"
                        rows={6}
                        {...register("descriptionEn")}
                        placeholder="Detail key responsibilities, daily workflow, and team scope..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="requirementsEn">{t("form.requirements")} (English)</Label>
                      <Textarea
                        id="requirementsEn"
                        rows={6}
                        {...register("requirementsEn")}
                        placeholder="List required degrees, certifications, years of experience..."
                      />
                    </div>
                  </div>
                }
                arabicFields={
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="titleAr">{t("form.positionTitle")} (بالعربية) *</Label>
                      <Input
                        id="titleAr"
                        dir="rtl"
                        {...register("titleAr")}
                        placeholder="مثال: مهندس أول أنظمة هيدروليكية"
                      />
                      {errors.titleAr && <span className="text-xs text-destructive">{errors.titleAr.message}</span>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="descriptionAr">{t("form.description")} (بالعربية)</Label>
                      <Textarea
                        id="descriptionAr"
                        dir="rtl"
                        rows={6}
                        {...register("descriptionAr")}
                        placeholder="تفاصيل المهام والمسؤوليات اليومية..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="requirementsAr">{t("form.requirements")} (بالعربية)</Label>
                      <Textarea
                        id="requirementsAr"
                        dir="rtl"
                        rows={6}
                        {...register("requirementsAr")}
                        placeholder="المؤهلات المطلوبة، الشهادات والخبرات..."
                      />
                    </div>
                  </div>
                }
                kurdishFields={
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="titleKu">{t("form.positionTitle")} (Kurdish)</Label>
                      <Input
                        id="titleKu"
                        dir="rtl"
                        {...register("titleKu")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="descriptionKu">{t("form.description")} (Kurdish)</Label>
                      <Textarea
                        id="descriptionKu"
                        dir="rtl"
                        rows={6}
                        {...register("descriptionKu")}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="requirementsKu">{t("form.requirements")} (Kurdish)</Label>
                      <Textarea
                        id="requirementsKu"
                        dir="rtl"
                        rows={6}
                        {...register("requirementsKu")}
                      />
                    </div>
                  </div>
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Right 1-Col: Shared Configuration Fields */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("rulesTitle")}</CardTitle>
              <CardDescription>{t("rulesSubtitle")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="slug">{t("form.slug")} *</Label>
                <Input id="slug" {...register("slug")} placeholder="senior-hydraulic-engineer" />
                {errors.slug && <span className="text-xs text-destructive">{errors.slug.message}</span>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="department">{t("form.department")}</Label>
                <Input id="department" {...register("department")} placeholder="e.g. Technical Operations" />
              </div>

              <div className="space-y-1.5">
                <Label>{t("form.employmentType")}</Label>
                <Select
                  value={employmentTypeValue}
                  onValueChange={(val: EmploymentType) => setValue("employmentType", val)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">{t("types.full_time")}</SelectItem>
                    <SelectItem value="part_time">{t("types.part_time")}</SelectItem>
                    <SelectItem value="contract">{t("types.contract")}</SelectItem>
                    <SelectItem value="internship">{t("types.internship")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="location">{t("form.location")}</Label>
                <Input id="location" {...register("location")} placeholder="e.g. Riyadh, KSA" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="closingDate">{t("form.closingDate")}</Label>
                <Input id="closingDate" type="date" {...register("closingDate")} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sortOrder">{t("form.sortOrder")}</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  {...register("sortOrder", { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-1.5 pt-2 border-t">
                <Label>{t("form.status")}</Label>
                <Select
                  value={statusValue}
                  onValueChange={(val: JobPostingStatus) => setValue("status", val)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">{t("postingStatus.published")}</SelectItem>
                    <SelectItem value="draft">{t("postingStatus.draft")}</SelectItem>
                    <SelectItem value="archived">{t("postingStatus.archived")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
