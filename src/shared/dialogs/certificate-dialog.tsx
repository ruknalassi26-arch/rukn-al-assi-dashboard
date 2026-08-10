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
import { Loader2 } from "lucide-react";
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
} from "@shared/ui";
import { MultilingualTabs } from "@shared/components/multilingual-tabs";
import { ImageUploader } from "@shared/upload/image-uploader";
import type { CertificateEntity } from "@features/homepage/domain/entities/homepage.entity";
import type { AboutCertificateEntity } from "@features/about/domain/entities/about.entity";

const certificateSchema = z.object({
  titleEn: z.string().min(2, "English title is required"),
  titleAr: z.string().min(2, "Arabic title is required"),
  titleKu: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  descriptionKu: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  issueDate: z.string().optional().nullable(),
  expiryDate: z.string().optional().nullable(),
  organization: z.string().optional().nullable(),
  sortOrder: z.number().min(0),
  status: z.enum(["active", "draft"]),
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
      expiryDate: "",
      organization: "",
      sortOrder: 1,
      status: "active",
    },
  });

  useEffect(() => {
    if (initialData) {
      if ("getTranslation" in initialData) {
        const en = initialData.getTranslation("en");
        const ar = initialData.getTranslation("ar");
        const ku = initialData.getTranslation("ckb");
        reset({
          titleEn: en.title || "",
          titleAr: ar.title || "",
          titleKu: ku.title || "",
          descriptionEn: en.description || "",
          descriptionAr: ar.description || "",
          descriptionKu: ku.description || "",
          image: initialData.imageUrl,
          issueDate: initialData.issuedDate ?? "",
          expiryDate: "",
          organization: initialData.issuedBy ?? "",
          sortOrder: initialData.sortOrder,
          status: initialData.status,
        });
      } else {
        reset({
          titleEn: (initialData as any).titleEn ?? "",
          titleAr: (initialData as any).titleAr ?? "",
          titleKu: ((initialData as unknown as Record<string, unknown>).titleKu as string) ?? "",
          descriptionEn: (initialData as any).descriptionEn ?? "",
          descriptionAr: (initialData as any).descriptionAr ?? "",
          descriptionKu: ((initialData as unknown as Record<string, unknown>).descriptionKu as string) ?? "",
          image: initialData.image,
          issueDate: (initialData as any).issueDate ?? "",
          expiryDate: (initialData as any).expiryDate ?? "",
          organization: (initialData as any).organization ?? "",
          sortOrder: initialData.sortOrder,
          status: initialData.status,
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
        expiryDate: "",
        organization: "",
        sortOrder: 1,
        status: "active",
      });
    }
  }, [initialData, reset, isOpen]);

  const image = watch("image");
  const status = watch("status");

  const onFormSubmit = async (values: CertificateFormValues) => {
    await onSubmit(values);
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t pt-3">
            <div>
              <Label className="text-xs" htmlFor="organization">{tDialogs("issuerEn")}</Label>
              <Input id="organization" {...register("organization")} placeholder="e.g. TÜV Rheinland" />
            </div>
            <div>
              <Label className="text-xs" htmlFor="issueDate">{tDialogs("issueDate")}</Label>
              <Input id="issueDate" type="date" {...register("issueDate")} />
            </div>
            <div>
              <Label className="text-xs" htmlFor="expiryDate">{tDialogs("expiryDate")}</Label>
              <Input id="expiryDate" type="date" {...register("expiryDate")} />
            </div>
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
