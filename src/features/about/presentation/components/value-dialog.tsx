"use client";
// ==============================================================================
// features/about/presentation/components/value-dialog.tsx
// Dialog form for creating/editing a Core Value
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
import type { CoreValueEntity } from "../../domain/entities/about.entity";

const valueSchema = z.object({
  titleEn: z.string().min(2, "English title is required"),
  titleAr: z.string().min(2, "Arabic title is required"),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  sortOrder: z.number().min(0),
  status: z.enum(["active", "draft"]),
});

type ValueFormValues = z.infer<typeof valueSchema>;

interface ValueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ValueFormValues) => Promise<void>;
  initialData?: CoreValueEntity | null;
  isLoading?: boolean;
}

export function ValueDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: ValueDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ValueFormValues>({
    resolver: zodResolver(valueSchema),
    defaultValues: {
      titleEn: "",
      titleAr: "",
      descriptionEn: "",
      descriptionAr: "",
      icon: "ShieldCheck",
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
        icon: initialData.icon ?? "ShieldCheck",
        sortOrder: initialData.sortOrder,
        status: initialData.status,
      });
    } else {
      reset({
        titleEn: "",
        titleAr: "",
        descriptionEn: "",
        descriptionAr: "",
        icon: "ShieldCheck",
        sortOrder: 1,
        status: "active",
      });
    }
  }, [initialData, reset, isOpen]);

  const icon = watch("icon");
  const status = watch("status");

  const onFormSubmit = async (values: ValueFormValues) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Core Value" : "Add Core Value"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="titleEn">Title (English) *</Label>
              <Input id="titleEn" {...register("titleEn")} placeholder="Integrity & Quality" />
              {errors.titleEn && (
                <span className="text-xs text-destructive">{errors.titleEn.message}</span>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="titleAr">Title (Arabic) *</Label>
              <Input id="titleAr" dir="rtl" {...register("titleAr")} placeholder="النزاهة والجودة" />
              {errors.titleAr && (
                <span className="text-xs text-destructive">{errors.titleAr.message}</span>
              )}
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

          <div className="space-y-1.5">
            <Label>Icon</Label>
            <Select value={icon ?? "ShieldCheck"} onValueChange={(val) => setValue("icon", val)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ShieldCheck">Shield Check / Integrity</SelectItem>
                <SelectItem value="Award">Award / Quality</SelectItem>
                <SelectItem value="Zap">Zap / Innovation</SelectItem>
                <SelectItem value="Users">Users / Teamwork</SelectItem>
                <SelectItem value="Heart">Heart / Customer First</SelectItem>
                <SelectItem value="CheckCircle">Check Circle / Reliability</SelectItem>
              </SelectContent>
            </Select>
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
              <Input
                id="sortOrder"
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
              {initialData ? "Save Changes" : "Add Core Value"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
