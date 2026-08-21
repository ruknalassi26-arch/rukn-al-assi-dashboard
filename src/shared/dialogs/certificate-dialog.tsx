"use client";
// ==============================================================================
// shared/dialogs/certificate-dialog.tsx
// Dialog form for creating/editing a Certificate with Bilingual Tabs & next-intl
// ==============================================================================
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Loader2, Star, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { formatDateForInput } from "@features/certificates/data/repositories/supabase-certificate.repository";
import type { CertificateEntity } from "@features/homepage/domain/entities/homepage.entity";
import type { AboutCertificateEntity } from "@features/about/domain/entities/about.entity";

const certificateSchema = z
  .object({
    titleEn: z.string().min(2, "English title is required"),
    titleAr: z.string().min(2, "Arabic title is required"),
    titleKu: z.string().optional().nullable(),
    descriptionEn: z.string().optional().nullable(),
    descriptionAr: z.string().optional().nullable(),
    descriptionKu: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    issueDate: z.string().optional().nullable(),
    organization: z.string().optional().nullable(),
    sortOrder: z.number().min(0),
    isFeatured: z.boolean(),
    featuredOrder: z.number().nullable().optional(),
    status: z.enum(["active", "draft"]),
  })
  .superRefine((data, ctx) => {
    if (data.isFeatured) {
      if (
        data.featuredOrder === null ||
        data.featuredOrder === undefined ||
        !Number.isInteger(data.featuredOrder) ||
        data.featuredOrder <= 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Featured order must be a positive integer",
          path: ["featuredOrder"],
        });
      }
    }
  });

type CertificateFormValues = z.infer<typeof certificateSchema>;

interface CertificateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CertificateFormValues) => Promise<void>;
  initialData?: CertificateEntity | AboutCertificateEntity | null;
  isLoading?: boolean;
}

export function CertificateDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: CertificateDialogProps) {
  const tCert = useTranslations("aboutAdmin.certificates");
  const tCommon = useTranslations("common");
  const tDialogs = useTranslations("common.dialogs");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      titleEn: "",
      titleAr: "",
      titleKu: "",
      descriptionEn: "",
      descriptionAr: "",
      descriptionKu: "",
      image: null,
      issueDate: "",
      organization: "",
      sortOrder: 1,
      isFeatured: false,
      featuredOrder: null,
      status: "active",
    },
  });

  const isFeaturedValue = watch("isFeatured");

  useEffect(() => {
    if (initialData) {
      if ("getTranslation" in initialData) {
        const aboutCert = initialData as AboutCertificateEntity;
        const en = aboutCert.getTranslation("en");
        const ar = aboutCert.getTranslation("ar");
        const ku = aboutCert.getTranslation("ckb");
        reset({
          titleEn: en.title || "",
          titleAr: ar.title || "",
          titleKu: ku.title || "",
          descriptionEn: en.description || "",
          descriptionAr: ar.description || "",
          descriptionKu: ku.description || "",
          image: aboutCert.imageUrl,
          issueDate: formatDateForInput(aboutCert.issuedDate),
          organization: aboutCert.issuedBy ?? "",
          sortOrder: aboutCert.sortOrder ?? 0,
          isFeatured: aboutCert.isFeatured ?? false,
          featuredOrder: aboutCert.featuredOrder ?? null,
          status: aboutCert.status === "published" ? "active" : "draft",
        });
      } else {
        const homeCert = initialData as CertificateEntity;
        reset({
          titleEn: homeCert.titleEn ?? "",
          titleAr: homeCert.titleAr ?? "",
          titleKu: "",
          descriptionEn: "",
          descriptionAr: "",
          descriptionKu: "",
          image: homeCert.image ?? null,
          issueDate: formatDateForInput(homeCert.issueDate),
          organization: "",
          sortOrder: homeCert.sortOrder ?? 0,
          isFeatured: homeCert.isFeatured ?? false,
          featuredOrder: homeCert.featuredOrder ?? null,
          status: homeCert.status === "active" ? "active" : "draft",
        });
      }
    } else {
      reset({
        titleEn: "",
        titleAr: "",
        titleKu: "",
        descriptionEn: "",
        descriptionAr: "",
        descriptionKu: "",
        image: null,
        issueDate: "",
        organization: "",
        sortOrder: 1,
        isFeatured: false,
        featuredOrder: null,
        status: "active",
      });
    }
  }, [initialData, reset, isOpen]);

  const image = watch("image");
  const status = watch("status");

  const onFormSubmit = async (values: CertificateFormValues) => {
    const isFeatured = values.isFeatured;
    const featuredOrder =
      isFeatured && values.featuredOrder !== null && values.featuredOrder !== undefined
        ? Math.floor(Number(values.featuredOrder))
        : null;

    await onSubmit({
      ...values,
      isFeatured,
      featuredOrder,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? `${tDialogs("edit")} ${tCert("title")}` : tCert("addBtn")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
          <ImageUploader
            label={tDialogs("uploadImage")}
            value={image ?? null}
            onChange={(url) => setValue("image", url)}
            folder="certificates"
          />

          <MultilingualTabs
            englishFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="titleEn">{tDialogs("titleEn")}</Label>
                  <Input id="titleEn" {...register("titleEn")} placeholder="ISO 9001:2015 Certification" />
                  {errors.titleEn && <span className="text-xs text-destructive">{errors.titleEn.message}</span>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="descriptionEn">{tDialogs("descEn")}</Label>
                  <Textarea id="descriptionEn" rows={3} {...register("descriptionEn")} />
                </div>
              </div>
            }
            arabicFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="titleAr">{tDialogs("titleAr")}</Label>
                  <Input id="titleAr" dir="rtl" {...register("titleAr")} placeholder="شهادة الآيزو ٩٠٠١" />
                  {errors.titleAr && <span className="text-xs text-destructive">{errors.titleAr.message}</span>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="descriptionAr">{tDialogs("descAr")}</Label>
                  <Textarea id="descriptionAr" rows={3} dir="rtl" {...register("descriptionAr")} />
                </div>
              </div>
            }
            kurdishFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="titleKu">{tDialogs("titleKu")}</Label>
                  <Input id="titleKu" dir="rtl" {...register("titleKu")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="descriptionKu">{tDialogs("descKu")}</Label>
                  <Textarea id="descriptionKu" rows={3} dir="rtl" {...register("descriptionKu")} />
                </div>
              </div>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t pt-3">
            <div>
              <Label className="text-xs" htmlFor="organization">{tDialogs("issuerEn")}</Label>
              <Input id="organization" {...register("organization")} placeholder="e.g. TÜV Rheinland" />
            </div>
            <div>
              <Label className="text-xs" htmlFor="issueDate">{tDialogs("issueDate")}</Label>
              <Input id="issueDate" type="date" {...register("issueDate")} />
            </div>
          </div>

          {/* Featured on Homepage */}
          <div className="rounded-lg border p-3 bg-muted/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dialogIsFeatured" className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                  <Star className={`h-3.5 w-3.5 ${isFeaturedValue ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`} />
                  Featured on Homepage
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  {isFeaturedValue ? "Yes — displayed on Homepage" : "No — hidden from Homepage"}
                </p>
              </div>
              <Switch
                id="dialogIsFeatured"
                checked={!!isFeaturedValue}
                onCheckedChange={(checked) => {
                  setValue("isFeatured", checked, { shouldValidate: true });
                  if (!checked) {
                    setValue("featuredOrder", null, { shouldValidate: true });
                  }
                }}
              />
            </div>

            {isFeaturedValue && (
              <div className="pt-2 border-t space-y-1.5">
                <Label htmlFor="dialogFeaturedOrder" className="text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  Featured Order *
                </Label>
                <Input
                  id="dialogFeaturedOrder"
                  type="number"
                  min={1}
                  step={1}
                  placeholder="e.g. 1, 2, 3..."
                  value={watch("featuredOrder") ?? ""}
                  onChange={(e) => {
                    const val = e.target.value === "" ? null : Number(e.target.value);
                    setValue("featuredOrder", val, { shouldValidate: true });
                  }}
                />
                <p className="text-[10px] text-muted-foreground">
                  Lower number appears first on the homepage.
                </p>
                {errors.featuredOrder && (
                  <p className="text-xs font-semibold text-destructive">{errors.featuredOrder.message as string}</p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{tCommon("status")}</Label>
              <Select value={status} onValueChange={(val: "active" | "draft") => setValue("status", val)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{tCommon("active")}</SelectItem>
                  <SelectItem value="draft">{tCommon("draft")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sortOrder">{tDialogs("sortOrder")}</Label>
              <Input id="sortOrder" type="number" {...register("sortOrder", { valueAsNumber: true })} />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {tDialogs("cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? tDialogs("saveChanges") : tCert("addBtn")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
