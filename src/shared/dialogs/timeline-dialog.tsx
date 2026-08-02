"use client";
// ==============================================================================
// shared/dialogs/timeline-dialog.tsx
// Dialog form for creating/editing a Timeline Milestone with Bilingual Tabs & next-intl
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
import { BilingualTabs } from "@shared/components/bilingual-tabs";
import { ImageUploader } from "@shared/upload/image-uploader";
import type { TimelineEntity } from "@features/about/domain/entities/about.entity";

const timelineSchema = z.object({
  year: z.string().min(1, "Year/Date is required"),
  titleEn: z.string().min(2, "English title is required"),
  titleAr: z.string().min(2, "Arabic title is required"),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  sortOrder: z.number().min(0),
  status: z.enum(["active", "draft"]),
});

type TimelineFormValues = z.infer<typeof timelineSchema>;

interface TimelineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TimelineFormValues) => Promise<void>;
  initialData?: TimelineEntity | null;
  isLoading?: boolean;
}

export function TimelineDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: TimelineDialogProps) {
  const tTimeline = useTranslations("aboutAdmin.timeline");
  const tCommon = useTranslations("common");
  const tDialogs = useTranslations("common.dialogs");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TimelineFormValues>({
    resolver: zodResolver(timelineSchema),
    defaultValues: {
      year: new Date().getFullYear().toString(),
      titleEn: "",
      titleAr: "",
      descriptionEn: "",
      descriptionAr: "",
      image: null,
      sortOrder: 1,
      status: "active",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        year: initialData.year,
        titleEn: initialData.titleEn,
        titleAr: initialData.titleAr,
        descriptionEn: initialData.descriptionEn ?? "",
        descriptionAr: initialData.descriptionAr ?? "",
        image: initialData.image,
        sortOrder: initialData.sortOrder,
        status: initialData.status,
      });
    } else {
      reset({
        year: new Date().getFullYear().toString(),
        titleEn: "",
        titleAr: "",
        descriptionEn: "",
        descriptionAr: "",
        image: null,
        sortOrder: 1,
        status: "active",
      });
    }
  }, [initialData, reset, isOpen]);

  const image = watch("image");
  const status = watch("status");

  const onFormSubmit = async (values: TimelineFormValues) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? `${tDialogs("edit")} ${tTimeline("title")}` : tTimeline("addBtn")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="year">{tDialogs("yearTimeframe")} *</Label>
            <Input id="year" {...register("year")} placeholder="e.g. 2015" />
            {errors.year && <span className="text-xs text-destructive">{errors.year.message}</span>}
          </div>

          <BilingualTabs
            englishFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="titleEn">{tDialogs("titleEn")}</Label>
                  <Input id="titleEn" {...register("titleEn")} placeholder="Expanded Factory Operations" />
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
                  <Input id="titleAr" dir="rtl" {...register("titleAr")} placeholder="توسعة عمليات المصنع" />
                  {errors.titleAr && <span className="text-xs text-destructive">{errors.titleAr.message}</span>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="descriptionAr">{tDialogs("descAr")}</Label>
                  <Textarea id="descriptionAr" rows={3} dir="rtl" {...register("descriptionAr")} />
                </div>
              </div>
            }
          />

          <ImageUploader
            label={tDialogs("uploadImage")}
            value={image ?? null}
            onChange={(url) => setValue("image", url)}
            folder="timeline"
          />

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
              {initialData ? tDialogs("saveChanges") : tTimeline("addBtn")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
