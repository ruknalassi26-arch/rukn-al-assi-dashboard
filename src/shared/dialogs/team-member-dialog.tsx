"use client";
// ==============================================================================
// shared/dialogs/team-member-dialog.tsx
// Dialog form for creating/editing a Management Team Member with Bilingual Tabs & next-intl
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
import type { TeamMemberEntity } from "@features/about/domain/entities/about.entity";

const teamMemberSchema = z.object({
  fullNameEn: z.string().min(2, "English name is required"),
  fullNameAr: z.string().min(2, "Arabic name is required"),
  positionEn: z.string().optional().nullable(),
  positionAr: z.string().optional().nullable(),
  biographyEn: z.string().optional().nullable(),
  biographyAr: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  photo: z.string().optional().nullable(),
  sortOrder: z.number().min(0),
  status: z.enum(["active", "draft"]),
});

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

interface TeamMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TeamMemberFormValues) => Promise<void>;
  initialData?: TeamMemberEntity | null;
  isLoading?: boolean;
}

export function TeamMemberDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: TeamMemberDialogProps) {
  const tTeam = useTranslations("aboutAdmin.team");
  const tCommon = useTranslations("common");
  const tDialogs = useTranslations("common.dialogs");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      fullNameEn: "",
      fullNameAr: "",
      positionEn: "",
      positionAr: "",
      biographyEn: "",
      biographyAr: "",
      linkedin: "",
      email: "",
      phone: "",
      photo: null,
      sortOrder: 1,
      status: "active",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        fullNameEn: initialData.fullNameEn,
        fullNameAr: initialData.fullNameAr,
        positionEn: initialData.positionEn ?? "",
        positionAr: initialData.positionAr ?? "",
        biographyEn: initialData.biographyEn ?? "",
        biographyAr: initialData.biographyAr ?? "",
        linkedin: initialData.linkedin ?? "",
        email: initialData.email ?? "",
        phone: initialData.phone ?? "",
        photo: initialData.photo,
        sortOrder: initialData.sortOrder,
        status: initialData.status,
      });
    } else {
      reset({
        fullNameEn: "",
        fullNameAr: "",
        positionEn: "",
        positionAr: "",
        biographyEn: "",
        biographyAr: "",
        linkedin: "",
        email: "",
        phone: "",
        photo: null,
        sortOrder: 1,
        status: "active",
      });
    }
  }, [initialData, reset, isOpen]);

  const photo = watch("photo");
  const status = watch("status");

  const onFormSubmit = async (values: TeamMemberFormValues) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? `${tDialogs("edit")} ${tTeam("title")}` : tTeam("addBtn")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
          <ImageUploader
            label={tDialogs("uploadImage")}
            value={photo ?? null}
            onChange={(url) => setValue("photo", url)}
            folder="team"
          />

          <BilingualTabs
            englishFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullNameEn">{tDialogs("nameEn")}</Label>
                  <Input id="fullNameEn" {...register("fullNameEn")} placeholder="e.g. Eng. Ahmad Al-Assi" />
                  {errors.fullNameEn && <span className="text-xs text-destructive">{errors.fullNameEn.message}</span>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="positionEn">{tDialogs("roleEn")}</Label>
                  <Input id="positionEn" {...register("positionEn")} placeholder="Chief Executive Officer" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="biographyEn">{tDialogs("bioEn")}</Label>
                  <Textarea id="biographyEn" rows={3} {...register("biographyEn")} />
                </div>
              </div>
            }
            arabicFields={
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullNameAr">{tDialogs("nameAr")}</Label>
                  <Input id="fullNameAr" dir="rtl" {...register("fullNameAr")} placeholder="م. أحمد العاصي" />
                  {errors.fullNameAr && <span className="text-xs text-destructive">{errors.fullNameAr.message}</span>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="positionAr">{tDialogs("roleAr")}</Label>
                  <Input id="positionAr" dir="rtl" {...register("positionAr")} placeholder="الرئيس التنفيذي" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="biographyAr">{tDialogs("bioAr")}</Label>
                  <Textarea id="biographyAr" rows={3} dir="rtl" {...register("biographyAr")} />
                </div>
              </div>
            }
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
              {initialData ? tDialogs("saveChanges") : tTeam("addBtn")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
