"use client";
// ==============================================================================
// shared/dialogs/value-dialog.tsx
// Dialog form for creating/editing a Core Value with Multilingual Tabs & next-intl
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
import { MultilingualTabs } from "@shared/components/multilingual-tabs";
import type { CoreValueEntity } from "@features/about/domain/entities/about.entity";

const valueSchema = z.object({
  titleEn: z.string().min(2, "English title is required"),
  titleAr: z.string().min(2, "Arabic title is required"),
  titleKu: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  descriptionKu: z.string().optional().nullable(),
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
  const tCore = useTranslations("aboutAdmin.coreValues");
  const tCommon = useTranslations("common");
  const tDialogs = useTranslations("common.dialogs");

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
      status: "active",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        titleEn: initialData.titleEn,
        titleAr: initialData.titleAr,
        titleKu: ((initialData as unknown as Record<string, unknown>).titleKu as string) ?? "",
        descriptionEn: initialData.descriptionEn ?? "",
        descriptionAr: initialData.descriptionAr ?? "",
        descriptionKu: ((initialData as unknown as Record<string, unknown>).descriptionKu as string) ?? "",
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
            {initialData ? `${tDialogs("edit")} ${tCore("title")}` : tCore("addBtn")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
          <MultilingualTabs
            englishFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="titleEn">{tDialogs("titleEn")}</Label>
                  <Input id="titleEn" {...register("titleEn")} placeholder="Integrity & Quality" />
                  {errors.titleEn && (
                    <span className="text-xs text-destructive">{errors.titleEn.message}</span>
                  )}
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
                  <Input id="titleAr" dir="rtl" {...register("titleAr")} placeholder="النزاهة والجودة" />
                  {errors.titleAr && (
                    <span className="text-xs text-destructive">{errors.titleAr.message}</span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="descriptionAr">{tDialogs("descAr")}</Label>
                  <Textarea id="descriptionAr" rows={3} dir="rtl" {...register("descriptionAr")} />
                </div>
              </div>
            }
            kurdishFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="titleKu">{tDialogs("titleKu")}</Label>
                  <Input id="titleKu" dir="rtl" {...register("titleKu")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="descriptionKu">{tDialogs("descKu")}</Label>
                  <Textarea id="descriptionKu" rows={3} dir="rtl" {...register("descriptionKu")} />
                </div>
              </div>
            }
          />

          <div className="space-y-1.5 pt-2 border-t">
            <Label>{tDialogs("icon")}</Label>
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
              <Input
                id="sortOrder"
                type="number"
                {...register("sortOrder", { valueAsNumber: true })}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {tDialogs("cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? tDialogs("saveChanges") : tCore("addBtn")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
