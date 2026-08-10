"use client";
// ==============================================================================
// features/about/presentation/components/timeline-dialog.tsx
// Dialog form for creating/editing a Timeline Event with Multilingual Language Tabs
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
import { MultilingualTabs } from "@shared/components/multilingual-tabs";
import type { TimelineEntity } from "../../domain/entities/about.entity";

const timelineSchema = z.object({
  eventYear: z.string().min(1, "Event year is required"),
  titleEn: z.string().min(1, "English title is required"),
  titleAr: z.string().optional().nullable(),
  titleKu: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  descriptionKu: z.string().optional().nullable(),
  sortOrder: z.number().min(0),
  status: z.enum(["published", "draft", "archived"]),
});

export type TimelineFormValues = z.infer<typeof timelineSchema>;

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
  isLoading,
}: TimelineDialogProps) {
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
      eventYear: String(new Date().getFullYear()),
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
        eventYear: String(initialData.eventYear ?? ""),
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
        eventYear: String(new Date().getFullYear()),
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

  const status = watch("status");

  const onFormSubmit = async (values: TimelineFormValues) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Timeline Event" : "Add Timeline Event"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => onFormSubmit(data as TimelineFormValues))} className="space-y-4 py-2">
          {/* Multilingual Tabs */}
          <MultilingualTabs
            englishFields={
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="titleEn">Title (EN) *</Label>
                  <Input id="titleEn" {...register("titleEn")} placeholder="Milestone Launched" />
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
                  <Label htmlFor="titleAr">Title (AR)</Label>
                  <Input id="titleAr" dir="rtl" {...register("titleAr")} placeholder="إطلاق الإنجاز" />
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
                  <Label htmlFor="titleKu">Title (KU)</Label>
                  <Input id="titleKu" dir="rtl" {...register("titleKu")} placeholder="دەستپێکردنی قۆناغ" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="descriptionKu">Description (KU)</Label>
                  <Textarea id="descriptionKu" rows={3} dir="rtl" {...register("descriptionKu")} placeholder="وەسف بە زمانی کوردی بنووسە..." />
                </div>
              </div>
            }
          />

          {/* Event Year, Sort Order & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t pt-4 mt-2">
            <div className="space-y-1">
              <Label htmlFor="eventYear">Event Year *</Label>
              <Input
                id="eventYear"
                {...register("eventYear")}
                placeholder="2024"
              />
              {errors.eventYear && <span className="text-xs text-destructive">{errors.eventYear.message}</span>}
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
              {initialData ? "Save Changes" : "Create Timeline Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
