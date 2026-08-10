"use client";
// ==============================================================================
// features/about/presentation/components/value-dialog.tsx
// Dialog form for creating/editing a Core Value (core_values & core_value_translations)
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
  titleEn: z.string().min(1, "English title is required"),
  titleAr: z.string().optional().nullable(),
  titleKu: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  descriptionKu: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  sortOrder: z.number().min(0),
  status: z.enum(["published", "draft", "archived"]),
});

export type ValueFormValues = z.infer<typeof valueSchema>;

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
      titleKu: "",
      descriptionEn: "",
      descriptionAr: "",
      descriptionKu: "",
      icon: "ShieldCheck",
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
        titleEn: en.title || "",
        titleAr: ar.title || "",
        titleKu: ku.title || "",
        descriptionEn: en.description || "",
        descriptionAr: ar.description || "",
        descriptionKu: ku.description || "",
        icon: initialData.icon ?? "ShieldCheck",
        sortOrder: initialData.sortOrder,
        status: initialData.status,
      });
    } else {
      reset({
        titleEn: "",
        titleAr: "",
        titleKu: "",
        descriptionEn: "",
        descriptionAr: "",
        descriptionKu: "",
        icon: "ShieldCheck",
        sortOrder: 1,
        status: "published",
      });
    }
  }, [initialData, reset, isOpen]);

  const status = watch("status");
  const icon = watch("icon");

  const handleFormSubmit = (data: any) => onSubmit(data as ValueFormValues);

  const onFormSubmit = async (values: ValueFormValues) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Core Value" : "Add Core Value"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
          {/* Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="titleEn">Title (EN) *</Label>
              <Input id="titleEn" {...register("titleEn")} placeholder="Integrity" />
              {errors.titleEn && <span className="text-xs text-destructive">{errors.titleEn.message}</span>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="titleAr">Title (AR)</Label>
              <Input id="titleAr" dir="rtl" {...register("titleAr")} placeholder="النزاهة" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="titleKu">Title (KU)</Label>
              <Input id="titleKu" dir="rtl" {...register("titleKu")} placeholder="دەستپاکیی" />
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

          {/* Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>Icon Name</Label>
              <Select value={icon ?? "ShieldCheck"} onValueChange={(val) => setValue("icon", val)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ShieldCheck">ShieldCheck</SelectItem>
                  <SelectItem value="Award">Award</SelectItem>
                  <SelectItem value="Target">Target</SelectItem>
                  <SelectItem value="Zap">Zap</SelectItem>
                  <SelectItem value="Heart">Heart</SelectItem>
                  <SelectItem value="Users">Users</SelectItem>
                  <SelectItem value="Star">Star</SelectItem>
                </SelectContent>
              </Select>
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
              {initialData ? "Save Changes" : "Create Core Value"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
