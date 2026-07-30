"use client";
// ==============================================================================
// features/homepage/presentation/components/stat-dialog.tsx
// Dialog form for creating/editing a company statistic
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
import type { CompanyStatEntity } from "../../domain/entities/homepage.entity";

const statSchema = z.object({
  titleEn: z.string().min(2, "English title is required"),
  titleAr: z.string().min(2, "Arabic title is required"),
  value: z.string().min(1, "Value is required"),
  icon: z.string().optional().nullable(),
  sortOrder: z.number().min(0),
  status: z.enum(["active", "draft"]),
});

type StatFormValues = z.infer<typeof statSchema>;

interface StatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: StatFormValues) => Promise<void>;
  initialData?: CompanyStatEntity | null;
  isLoading?: boolean;
}

export function StatDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: StatDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StatFormValues>({
    resolver: zodResolver(statSchema),
    defaultValues: {
      titleEn: "",
      titleAr: "",
      value: "",
      icon: "Award",
      sortOrder: 1,
      status: "active",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        titleEn: initialData.titleEn,
        titleAr: initialData.titleAr,
        value: initialData.value,
        icon: initialData.icon ?? "Award",
        sortOrder: initialData.sortOrder,
        status: initialData.status,
      });
    } else {
      reset({
        titleEn: "",
        titleAr: "",
        value: "",
        icon: "Award",
        sortOrder: 1,
        status: "active",
      });
    }
  }, [initialData, reset, isOpen]);

  const status = watch("status");
  const icon = watch("icon");

  const onFormSubmit = async (values: StatFormValues) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Company Statistic" : "Add Company Statistic"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="value">Metric Value *</Label>
            <Input id="value" {...register("value")} placeholder="e.g. 15+, 500+, 99%" />
            {errors.value && (
              <span className="text-xs text-destructive">{errors.value.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="titleEn">Title (English) *</Label>
              <Input id="titleEn" {...register("titleEn")} placeholder="Years Experience" />
              {errors.titleEn && (
                <span className="text-xs text-destructive">{errors.titleEn.message}</span>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="titleAr">Title (Arabic) *</Label>
              <Input id="titleAr" dir="rtl" {...register("titleAr")} placeholder="سنوات الخبرة" />
              {errors.titleAr && (
                <span className="text-xs text-destructive">{errors.titleAr.message}</span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Icon Name</Label>
            <Select value={icon ?? "Award"} onValueChange={(val) => setValue("icon", val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Award">Award / Trophy</SelectItem>
                <SelectItem value="Users">Users / Clients</SelectItem>
                <SelectItem value="Briefcase">Briefcase / Projects</SelectItem>
                <SelectItem value="Wrench">Wrench / Services</SelectItem>
                <SelectItem value="Package">Package / Products</SelectItem>
                <SelectItem value="CheckCircle">Check Circle / Guarantee</SelectItem>
                <SelectItem value="Clock">Clock / Years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(val: "active" | "draft") => setValue("status", val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
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
              {initialData ? "Save Changes" : "Add Statistic"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
