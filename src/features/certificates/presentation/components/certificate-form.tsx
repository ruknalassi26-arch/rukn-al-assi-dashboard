"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Loader2, Save, ArrowLeft, Shield } from "lucide-react";
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
import { ImageUploader } from "@shared/upload/image-uploader";
import { useCreateCertificate, useUpdateCertificate } from "@shared/hooks/certificates/use-certificate-hooks";
import type { CertificateEntity } from "../../domain/entities/certificate.entity";

const certificateSchema = z.object({
  titleEn: z.string().min(2, "English title is required"),
  titleAr: z.string().min(2, "Arabic title is required"),
  titleKu: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  descriptionKu: z.string().optional().nullable(),
  organization: z.string().optional().nullable(),
  organizationAr: z.string().optional().nullable(),
  organizationKu: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  issueDate: z.string().optional().nullable(),
  expiryDate: z.string().optional().nullable(),
  status: z.enum(["active", "draft"]),
  sortOrder: z.number().min(0),
});

export type CertificateFormValues = z.infer<typeof certificateSchema>;

interface CertificateFormProps {
  initialData?: CertificateEntity | null;
}

export function CertificateForm({ initialData }: CertificateFormProps) {
  const router = useRouter();
  const tForm = useTranslations("certificateForm");
  const tCommon = useTranslations("common");
  const isEditing = !!initialData;

  const createCertificateMutation = useCreateCertificate();
  const updateCertificateMutation = useUpdateCertificate();
  const isSubmitting = createCertificateMutation.isPending || updateCertificateMutation.isPending;

  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      titleEn: initialData?.titleEn ?? "",
      titleAr: initialData?.titleAr ?? "",
      titleKu: initialData?.titleKu ?? "",
      descriptionEn: initialData?.descriptionEn ?? "",
      descriptionAr: initialData?.descriptionAr ?? "",
      descriptionKu: initialData?.descriptionKu ?? "",
      organization: initialData?.organization ?? "",
      organizationAr: initialData?.organizationAr ?? "",
      organizationKu: initialData?.organizationKu ?? "",
      image: initialData?.image ?? "",
      issueDate: initialData?.issueDate ?? "",
      expiryDate: initialData?.expiryDate ?? "",
      status: initialData?.status ?? "active",
      sortOrder: initialData?.sortOrder ?? 0,
    },
  });

  const { watch, setValue, register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (values: CertificateFormValues) => {
    try {
      if (isEditing && initialData) {
        await updateCertificateMutation.mutateAsync({
          id: initialData.id,
          ...values,
        });
      } else {
        await createCertificateMutation.mutateAsync(values);
      }
      router.push("/admin/certificates");
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
            onClick={() => router.push("/admin/certificates")}
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
            onClick={() => router.push("/admin/certificates")}
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
        {/* Main Translatable Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                {tForm("infoTitle")}
              </CardTitle>
              <CardDescription>
                {tForm("infoSubtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MultilingualTabs
                englishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="titleEn">{tForm("titleEn")} *</Label>
                      <Input
                        id="titleEn"
                        {...register("titleEn")}
                      />
                      {errors.titleEn && (
                        <p className="text-xs font-semibold text-destructive">{errors.titleEn.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization">{tForm("orgEn")}</Label>
                      <Input
                        id="organization"
                        {...register("organization")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionEn">{tForm("descEn")}</Label>
                      <Textarea
                        id="descriptionEn"
                        className="min-h-[140px]"
                        {...register("descriptionEn")}
                      />
                    </div>
                  </div>
                }
                arabicFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="titleAr">{tForm("titleAr")} *</Label>
                      <Input
                        id="titleAr"
                        dir="rtl"
                        {...register("titleAr")}
                      />
                      {errors.titleAr && (
                        <p className="text-xs font-semibold text-destructive">{errors.titleAr.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organizationAr">{tForm("orgAr")}</Label>
                      <Input
                        id="organizationAr"
                        dir="rtl"
                        {...register("organizationAr")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionAr">{tForm("descAr")}</Label>
                      <Textarea
                        id="descriptionAr"
                        dir="rtl"
                        className="min-h-[140px]"
                        {...register("descriptionAr")}
                      />
                    </div>
                  </div>
                }
                kurdishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="titleKu">{tForm("titleKu")}</Label>
                      <Input
                        id="titleKu"
                        dir="rtl"
                        {...register("titleKu")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organizationKu">{tForm("orgKu")}</Label>
                      <Input
                        id="organizationKu"
                        dir="rtl"
                        {...register("organizationKu")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionKu">{tForm("descKu")}</Label>
                      <Textarea
                        id="descriptionKu"
                        dir="rtl"
                        className="min-h-[140px]"
                        {...register("descriptionKu")}
                      />
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
              <CardTitle>{tForm("datesTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="issueDate">{tForm("issueDate")}</Label>
                <Input
                  id="issueDate"
                  type="date"
                  {...register("issueDate")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">{tForm("expiryDate")}</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  {...register("expiryDate")}
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
            </CardContent>
          </Card>

          {/* Certificate Image / Document Preview */}
          <Card>
            <CardHeader>
              <CardTitle>{tForm("imageTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                value={watch("image") ?? ""}
                onChange={(url) => setValue("image", url)}
                bucket="certificates"
                folder="certs"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
