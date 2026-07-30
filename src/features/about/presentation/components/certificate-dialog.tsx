"use client";
// ==============================================================================
// features/about/presentation/components/certificate-dialog.tsx
// Dialog form for creating/editing an About Module Certificate
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
import { ImageUploader } from "@features/homepage/presentation/components/image-uploader";
import type { AboutCertificateEntity } from "../../domain/entities/about.entity";

const certificateSchema = z.object({
  titleEn: z.string().min(2, "English title is required"),
  titleAr: z.string().min(2, "Arabic title is required"),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
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
  initialData?: AboutCertificateEntity | null;
  isLoading?: boolean;
}

export function CertificateDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
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
      titleEn: "",
      titleAr: "",
      descriptionEn: "",
      descriptionAr: "",
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
      reset({
        titleEn: initialData.titleEn,
        titleAr: initialData.titleAr,
        descriptionEn: initialData.descriptionEn ?? "",
        descriptionAr: initialData.descriptionAr ?? "",
        image: initialData.image,
        issueDate: initialData.issueDate ?? "",
        expiryDate: initialData.expiryDate ?? "",
        organization: initialData.organization ?? "",
        sortOrder: initialData.sortOrder,
        status: initialData.status,
      });
    } else {
      reset({
        titleEn: "",
        titleAr: "",
        descriptionEn: "",
        descriptionAr: "",
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
            {initialData ? "Edit Certificate" : "Add Certificate"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
          <ImageUploader
            label="Certificate Badge / Document"
            value={image ?? null}
            onChange={(url) => setValue("image", url)}
            folder="certificates"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="titleEn">Title (English) *</Label>
              <Input id="titleEn" {...register("titleEn")} placeholder="ISO 9001:2015 Certification" />
              {errors.titleEn && <span className="text-xs text-destructive">{errors.titleEn.message}</span>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="titleAr">Title (Arabic) *</Label>
              <Input id="titleAr" dir="rtl" {...register("titleAr")} placeholder="شهادة الآيزو ٩٠٠١" />
              {errors.titleAr && <span className="text-xs text-destructive">{errors.titleAr.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="descriptionEn">Description (English)</Label>
              <Textarea id="descriptionEn" rows={3} {...register("descriptionEn")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="descriptionAr">Description (Arabic)</Label>
              <Textarea id="descriptionAr" rows={3} dir="rtl" {...register("descriptionAr")} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs" htmlFor="organization">Issuing Body</Label>
              <Input id="organization" size={1} {...register("organization")} placeholder="e.g. TÜV Rheinland" />
            </div>
            <div>
              <Label className="text-xs" htmlFor="issueDate">Issue Date</Label>
              <Input id="issueDate" size={1} type="date" {...register("issueDate")} />
            </div>
            <div>
              <Label className="text-xs" htmlFor="expiryDate">Expiry Date</Label>
              <Input id="expiryDate" size={1} type="date" {...register("expiryDate")} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(val: "active" | "draft") => setValue("status", val)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input id="sortOrder" type="number" {...register("sortOrder", { valueAsNumber: true })} />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Save Changes" : "Add Certificate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
