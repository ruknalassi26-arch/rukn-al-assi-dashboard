"use client";
// ==============================================================================
// features/about/presentation/components/timeline-dialog.tsx
// Dialog form for creating/editing a Timeline Event (timeline_events & timeline_event_translations)
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
  status: z.enum(["active", "draft"]),
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
  isLoading = false,
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
      status: "active",
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
        status: "active",
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

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
          {/* Year & Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="eventYear">Event Year *</Label>
              <Input id="eventYear" {...register("eventYear")} placeholder="e.g. 2024" />
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
              <Select value={status} onValueChange={(val) => setValue("status", val as "active" | "draft")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="titleEn">Title (EN) *</Label>
              <Input id="titleEn" {...register("titleEn")} placeholder="Milestone Launched" />
              {errors.titleEn && <span className="text-xs text-destructive">{errors.titleEn.message}</span>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="titleAr">Title (AR)</Label>
              <Input id="titleAr" dir="rtl" {...register("titleAr")} placeholder="إطلاق الإنجاز" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="titleKu">Title (KU)</Label>
              <Input id="titleKu" dir="rtl" {...register("titleKu")} placeholder="دەستپێکردنی قۆناغ" />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="descriptionEn">Description (EN)</Label>
              <Textarea id="descriptionEn" rows={3} {...register("descriptionEn")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="descriptionAr">Description (AR)</Label>
              <Textarea id="descriptionAr" rows={3} dir="rtl" {...register("descriptionAr")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="descriptionKu">Description (KU)</Label>
              <Textarea id="descriptionKu" rows={3} dir="rtl" {...register("descriptionKu")} />
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
