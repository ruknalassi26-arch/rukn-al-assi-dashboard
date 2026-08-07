"use client";
// ==============================================================================
// shared/dialogs/client-dialog.tsx
// Dialog form for creating/editing a Client Partner with Bilingual Tabs
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui";
import { MultilingualTabs } from "@shared/components/multilingual-tabs";
import { ImageUploader } from "@shared/upload/image-uploader";
import type { ClientEntity } from "@features/homepage/domain/entities/homepage.entity";

const clientSchema = z.object({
  nameEn: z.string().min(2, "English name is required"),
  nameAr: z.string().min(2, "Arabic name is required"),
  nameKu: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
  sortOrder: z.number().min(0),
  status: z.enum(["active", "draft"]),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ClientFormValues) => Promise<void>;
  initialData?: ClientEntity | null;
  isLoading?: boolean;
}

export function ClientDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: ClientDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nameEn: "",
      nameAr: "",
      nameKu: "",
      logoUrl: null,
      websiteUrl: "",
      sortOrder: 1,
      status: "active",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nameEn: initialData.nameEn,
        nameAr: initialData.nameAr,
        nameKu: ((initialData as unknown as Record<string, unknown>).nameKu as string) ?? "",
        logoUrl: initialData.logoUrl,
        websiteUrl: initialData.websiteUrl ?? "",
        sortOrder: initialData.sortOrder,
        status: initialData.status,
      });
    } else {
      reset({
        nameEn: "",
        nameAr: "",
        nameKu: "",
        logoUrl: null,
        websiteUrl: "",
        sortOrder: 1,
        status: "active",
      });
    }
  }, [initialData, reset, isOpen]);

  const logoUrl = watch("logoUrl");
  const status = watch("status");

  const onFormSubmit = async (values: ClientFormValues) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Client Partner" : "Add Client Partner"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
          <ImageUploader
            label="Client Logo"
            value={logoUrl ?? null}
            onChange={(url) => setValue("logoUrl", url)}
            folder="clients"
          />

          <MultilingualTabs
            englishFields={
              <div className="space-y-1.5">
                <Label htmlFor="nameEn">Client Name (English) *</Label>
                <Input id="nameEn" {...register("nameEn")} placeholder="Saudi Aramco" />
                {errors.nameEn && <span className="text-xs text-destructive">{errors.nameEn.message}</span>}
              </div>
            }
            arabicFields={
              <div className="space-y-1.5">
                <Label htmlFor="nameAr">اسم العميل (بالعربية) *</Label>
                <Input id="nameAr" dir="rtl" {...register("nameAr")} placeholder="أرامكو السعودية" />
                {errors.nameAr && <span className="text-xs text-destructive">{errors.nameAr.message}</span>}
              </div>
            }
            kurdishFields={
              <div className="space-y-1.5">
                <Label htmlFor="nameKu">Client Name (Kurdish)</Label>
                <Input id="nameKu" dir="rtl" {...register("nameKu")} />
              </div>
            }
          />

          <div className="space-y-1.5 pt-2 border-t">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input id="websiteUrl" {...register("websiteUrl")} placeholder="https://..." />
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
              {initialData ? "Save Changes" : "Add Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
