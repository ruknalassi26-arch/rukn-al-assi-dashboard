"use client";
// ==============================================================================
// features/about/presentation/components/certificate-dialog.tsx
// Dialog form for creating/editing a Certificate with Multilingual Language Tabs
// ==============================================================================
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { ImageUploader } from "@shared/upload/image-uploader";
import { MultilingualTabs } from "@shared/components/multilingual-tabs";
import type { AboutCertificateEntity } from "../../domain/entities/about.entity";

const certificateSchema = z.object({
  imageUrl: z.string().optional().nullable(),
  issuedBy: z.string().optional().nullable(),
  issuedDate: z.string().optional().nullable(),
  titleEn: z.string().min(1, "English title is required"),
  titleAr: z.string().optional().nullable(),
  titleKu: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  descriptionKu: z.string().optional().nullable(),
  sortOrder: z.number().min(0),
  status: z.enum(["published", "draft", "archived"]),
});

export type CertificateFormValues = z.infer<typeof certificateSchema>;

interface CertificateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CertificateFormValues) => Promise<void>;
  initialData?: AboutCertificateEntity | null;
  isLoading?: boolean;
}

export function CertificateDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: CertificateDialogProps) {
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
      imageUrl: "",
      issuedBy: "",
      issuedDate: "",
      titleEn: "",
      titleAr: "",
      titleKu: "",
      descriptionEn: "",
      descriptionAr: "",
      descriptionKu: "",
      sortOrder: 1,
      status: "published",
    },
  });

  useEffect(() => {
    if (initialData) {
      const en = initialData.getTranslation("en");
      const ar = initialData.getTranslation("ar");
      const ku = initialData.getTranslation("ckb");
      reset({
        imageUrl: initialData.imageUrl ?? "",
        issuedBy: initialData.issuedBy ?? "",
        issuedDate: initialData.issuedDate ?? "",
        titleEn: en.title || "",
        titleAr: ar.title || "",
        titleKu: ku.title || "",
        descriptionEn: en.description || "",
        descriptionAr: ar.description || "",
        descriptionKu: ku.description || "",
        sortOrder: initialData.sortOrder,
        status: initialData.status,
      });
    } else {
      reset({
        imageUrl: "",
        issuedBy: "",
        issuedDate: "",
        titleEn: "",
        titleAr: "",
        titleKu: "",
        descriptionEn: "",
        descriptionAr: "",
        descriptionKu: "",
        sortOrder: 1,
        status: "published",
      });
    }
  }, [initialData, reset, isOpen]);

  const imageUrl = watch("imageUrl");
  const status = watch("status");

  const onFormSubmit = async (values: CertificateFormValues) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Certificate" : "Add Certificate"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => onFormSubmit(data as CertificateFormValues))} className="space-y-4 py-2">
          {/* Certificate Image Uploader */}
          <div className="space-y-1">
            <Label>Certificate Image</Label>
            <ImageUploader
              value={imageUrl ?? null}
              onChange={(url) => setValue("imageUrl", url ?? null)}
              bucket="certificates"
              folder="certs"
            />
          </div>

          {/* Multilingual Tabs */}
          <MultilingualTabs
            englishFields={
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="titleEn">Certificate Title (EN) *</Label>
                  <Input id="titleEn" {...register("titleEn")} placeholder="ISO 9001:2015 Quality Management" />
                  {errors.titleEn && <span className="text-xs text-destructive">{errors.titleEn.message}</span>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="descriptionEn">Description (EN)</Label>
                  <Textarea id="descriptionEn" rows={3} {...register("descriptionEn")} placeholder="Enter English description..." />
                </div>
              </div>
            }
            arabicFields={
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="titleAr">Certificate Title (AR)</Label>
                  <Input id="titleAr" dir="rtl" {...register("titleAr")} placeholder="شهادة إدارة الجودة إيزو ٩٠٠١" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="descriptionAr">Description (AR)</Label>
                  <Textarea id="descriptionAr" rows={3} dir="rtl" {...register("descriptionAr")} placeholder="أدخل الوصف باللغة العربية..." />
                </div>
              </div>
            }
            kurdishFields={
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="titleKu">Certificate Title (KU)</Label>
                  <Input id="titleKu" dir="rtl" {...register("titleKu")} placeholder="بڕوانامەی ئایزۆ ٩٠٠١" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="descriptionKu">Description (KU)</Label>
                  <Textarea id="descriptionKu" rows={3} dir="rtl" {...register("descriptionKu")} placeholder="وەسف بە زمانی کوردی بنووسە..." />
                </div>
              </div>
            }
          />

          {/* Issued By, Issued Date, Sort Order & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t pt-4 mt-2">
            <div className="space-y-1">
              <Label htmlFor="issuedBy">Issued By</Label>
              <Input id="issuedBy" {...register("issuedBy")} placeholder="International ISO Organization" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="issuedDate">Issued Date</Label>
              <Input id="issuedDate" type="date" {...register("issuedDate")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                {...register("sortOrder", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={status} onValueChange={(val) => setValue("status", val as "published" | "draft" | "archived")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Save Changes" : "Create Certificate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
