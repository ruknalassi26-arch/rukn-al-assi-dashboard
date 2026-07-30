"use client";
// ==============================================================================
// shared/dialogs/hero-slide-dialog.tsx
// Dialog form for creating/editing a Homepage Hero Slide with Bilingual Tabs
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
import { BilingualTabs } from "@shared/components/bilingual-tabs";
import { ImageUploader } from "@shared/upload/image-uploader";
import type { HeroSlideEntity } from "@features/homepage/domain/entities/homepage.entity";

const heroSlideSchema = z.object({
  titleEn: z.string().min(2, "English title is required"),
  titleAr: z.string().min(2, "Arabic title is required"),
  subtitleEn: z.string().optional().nullable(),
  subtitleAr: z.string().optional().nullable(),
  primaryButtonTextEn: z.string().optional().nullable(),
  primaryButtonTextAr: z.string().optional().nullable(),
  primaryButtonUrl: z.string().optional().nullable(),
  secondaryButtonTextEn: z.string().optional().nullable(),
  secondaryButtonTextAr: z.string().optional().nullable(),
  secondaryButtonUrl: z.string().optional().nullable(),
  backgroundImage: z.string().optional().nullable(),
  overlayOpacity: z.number().min(0).max(100),
  status: z.enum(["active", "draft"]),
  sortOrder: z.number().min(0),
});

type HeroSlideFormValues = z.infer<typeof heroSlideSchema>;

interface HeroSlideDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: HeroSlideFormValues) => Promise<void>;
  initialData?: HeroSlideEntity | null;
  isLoading?: boolean;
}

export function HeroSlideDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: HeroSlideDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<HeroSlideFormValues>({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: {
      titleEn: "",
      titleAr: "",
      subtitleEn: "",
      subtitleAr: "",
      primaryButtonTextEn: "",
      primaryButtonTextAr: "",
      primaryButtonUrl: "",
      secondaryButtonTextEn: "",
      secondaryButtonTextAr: "",
      secondaryButtonUrl: "",
      backgroundImage: null,
      overlayOpacity: 40,
      status: "active",
      sortOrder: 1,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        titleEn: initialData.titleEn,
        titleAr: initialData.titleAr,
        subtitleEn: initialData.subtitleEn ?? "",
        subtitleAr: initialData.subtitleAr ?? "",
        primaryButtonTextEn: initialData.primaryButtonTextEn ?? "",
        primaryButtonTextAr: initialData.primaryButtonTextAr ?? "",
        primaryButtonUrl: initialData.primaryButtonUrl ?? "",
        secondaryButtonTextEn: initialData.secondaryButtonTextEn ?? "",
        secondaryButtonTextAr: initialData.secondaryButtonTextAr ?? "",
        secondaryButtonUrl: initialData.secondaryButtonUrl ?? "",
        backgroundImage: initialData.backgroundImage,
        overlayOpacity: initialData.overlayOpacity ?? 40,
        status: initialData.status,
        sortOrder: initialData.sortOrder,
      });
    } else {
      reset({
        titleEn: "",
        titleAr: "",
        subtitleEn: "",
        subtitleAr: "",
        primaryButtonTextEn: "",
        primaryButtonTextAr: "",
        primaryButtonUrl: "",
        secondaryButtonTextEn: "",
        secondaryButtonTextAr: "",
        secondaryButtonUrl: "",
        backgroundImage: null,
        overlayOpacity: 40,
        status: "active",
        sortOrder: 1,
      });
    }
  }, [initialData, reset, isOpen]);

  const backgroundImage = watch("backgroundImage");
  const status = watch("status");

  const onFormSubmit = async (values: HeroSlideFormValues) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Hero Slide" : "Add Hero Slide"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
          <ImageUploader
            label="Background Image"
            value={backgroundImage ?? null}
            onChange={(url) => setValue("backgroundImage", url)}
            folder="hero"
          />

          <BilingualTabs
            englishFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="titleEn">Title (English) *</Label>
                  <Input id="titleEn" {...register("titleEn")} placeholder="Engineering Excellence" />
                  {errors.titleEn && <span className="text-xs text-destructive">{errors.titleEn.message}</span>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subtitleEn">Subtitle (English)</Label>
                  <Textarea id="subtitleEn" rows={2} {...register("subtitleEn")} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border p-3 rounded-lg bg-muted/20">
                  <div>
                    <Label className="text-xs">Primary Btn (EN)</Label>
                    <Input {...register("primaryButtonTextEn")} placeholder="Our Products" />
                  </div>
                  <div>
                    <Label className="text-xs">Secondary Btn (EN)</Label>
                    <Input {...register("secondaryButtonTextEn")} placeholder="Contact Us" />
                  </div>
                </div>
              </div>
            }
            arabicFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="titleAr">العنوان (بالعربية) *</Label>
                  <Input id="titleAr" dir="rtl" {...register("titleAr")} placeholder="التميز الهندسي" />
                  {errors.titleAr && <span className="text-xs text-destructive">{errors.titleAr.message}</span>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subtitleAr">العنوان الفرعي (بالعربية)</Label>
                  <Textarea id="subtitleAr" rows={2} dir="rtl" {...register("subtitleAr")} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border p-3 rounded-lg bg-muted/20">
                  <div>
                    <Label className="text-xs">زر رئيسي (بالعربية)</Label>
                    <Input dir="rtl" {...register("primaryButtonTextAr")} placeholder="منتجاتنا" />
                  </div>
                  <div>
                    <Label className="text-xs">زر ثانوي (بالعربية)</Label>
                    <Input dir="rtl" {...register("secondaryButtonTextAr")} placeholder="اتصل بنا" />
                  </div>
                </div>
              </div>
            }
          />

          {/* Button URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border p-3 rounded-lg bg-muted/20">
            <div>
              <Label className="text-xs">Primary Button URL</Label>
              <Input {...register("primaryButtonUrl")} placeholder="/products" />
            </div>
            <div>
              <Label className="text-xs">Secondary Button URL</Label>
              <Input {...register("secondaryButtonUrl")} placeholder="/contact" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Overlay Opacity (%)</Label>
              <Input
                type="number"
                {...register("overlayOpacity", { valueAsNumber: true })}
              />
            </div>
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
              <Label>Sort Order</Label>
              <Input
                type="number"
                {...register("sortOrder", { valueAsNumber: true })}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Save Changes" : "Add Hero Slide"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
