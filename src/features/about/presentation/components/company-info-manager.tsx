"use client";
// ==============================================================================
// features/about/presentation/components/company-info-manager.tsx
// Management form for Company Information with Bilingual Tabs
// ==============================================================================
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Loader2, Save, Building } from "lucide-react";
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
import { useCompanyInfo, useUpdateCompanyInfo } from "@shared/hooks/about/use-about-hooks";
import { ErrorState } from "@shared/components/error-state";

const companyInfoSchema = z.object({
  companyNameEn: z.string().min(2, "English company name is required"),
  companyNameAr: z.string().min(2, "Arabic company name is required"),
  shortDescriptionEn: z.string().optional().nullable(),
  shortDescriptionAr: z.string().optional().nullable(),
  fullDescriptionEn: z.string().optional().nullable(),
  fullDescriptionAr: z.string().optional().nullable(),
  establishedYear: z.number().nullable().optional(),
  headquarters: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  status: z.enum(["active", "draft"]),
});

type CompanyInfoFormValues = z.infer<typeof companyInfoSchema>;

export function CompanyInfoManager() {
  const t = useTranslations("aboutAdmin.overview");
  const tCommon = useTranslations("common");
  const { data: companyData, isLoading, error, refetch } = useCompanyInfo();
  const updateMutation = useUpdateCompanyInfo();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CompanyInfoFormValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      companyNameEn: "Rukn Al Assi",
      companyNameAr: "ركن العاصي",
      shortDescriptionEn: "",
      shortDescriptionAr: "",
      fullDescriptionEn: "",
      fullDescriptionAr: "",
      establishedYear: 2010,
      headquarters: "Riyadh, Saudi Arabia",
      website: "https://ruknalassi.com",
      phone: "+966 11 000 0000",
      email: "info@ruknalassi.com",
      status: "active",
    },
  });

  useEffect(() => {
    if (companyData) {
      reset({
        companyNameEn: companyData.companyNameEn,
        companyNameAr: companyData.companyNameAr,
        shortDescriptionEn: companyData.shortDescriptionEn ?? "",
        shortDescriptionAr: companyData.shortDescriptionAr ?? "",
        fullDescriptionEn: companyData.fullDescriptionEn ?? "",
        fullDescriptionAr: companyData.fullDescriptionAr ?? "",
        establishedYear: companyData.establishedYear,
        headquarters: companyData.headquarters ?? "",
        website: companyData.website ?? "",
        phone: companyData.phone ?? "",
        email: companyData.email ?? "",
        status: companyData.status,
      });
    }
  }, [companyData, reset]);

  const status = watch("status");

  const onSubmit = async (values: CompanyInfoFormValues) => {
    await updateMutation.mutateAsync(values);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorState
        title={tCommon("error")}
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <CardTitle>{t("title")}</CardTitle>
            </div>
            <CardDescription>
              {t("subtitle")}
            </CardDescription>
          </div>
          <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {t("saveBtn")}
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <BilingualTabs
            englishFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="companyNameEn">{t("nameEn")} *</Label>
                  <Input id="companyNameEn" {...register("companyNameEn")} />
                  {errors.companyNameEn && (
                    <span className="text-xs text-destructive">{errors.companyNameEn.message}</span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="shortDescriptionEn">{t("shortEn")}</Label>
                  <Textarea id="shortDescriptionEn" rows={2} {...register("shortDescriptionEn")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fullDescriptionEn">{t("fullEn")}</Label>
                  <Textarea id="fullDescriptionEn" rows={5} {...register("fullDescriptionEn")} />
                </div>
              </div>
            }
            arabicFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="companyNameAr">{t("nameAr")} *</Label>
                  <Input id="companyNameAr" dir="rtl" {...register("companyNameAr")} />
                  {errors.companyNameAr && (
                    <span className="text-xs text-destructive">{errors.companyNameAr.message}</span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="shortDescriptionAr">{t("shortAr")}</Label>
                  <Textarea id="shortDescriptionAr" dir="rtl" rows={2} {...register("shortDescriptionAr")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fullDescriptionAr">{t("fullAr")}</Label>
                  <Textarea id="fullDescriptionAr" dir="rtl" rows={5} {...register("fullDescriptionAr")} />
                </div>
              </div>
            }
          />

          {/* Meta & Global Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 border p-4 rounded-lg bg-muted/10">
            <div className="space-y-1.5">
              <Label htmlFor="establishedYear">{t("estYear")}</Label>
              <Input
                id="establishedYear"
                type="number"
                {...register("establishedYear", { valueAsNumber: true })}
                placeholder="2010"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="headquarters">{t("headquarters")}</Label>
              <Input id="headquarters" {...register("headquarters")} placeholder="Riyadh, KSA" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input id="phone" {...register("phone")} placeholder="+966 ..." />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" {...register("email")} placeholder="info@..." />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="website">{t("website")}</Label>
              <Input id="website" type="url" {...register("website")} placeholder="https://..." />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">{tCommon("status")}</Label>
              <Select value={status} onValueChange={(val) => setValue("status", val as "active" | "draft")}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{tCommon("active")}</SelectItem>
                  <SelectItem value="draft">{tCommon("draft")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
