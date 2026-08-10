"use client";
// ==============================================================================
// features/about/presentation/components/team-member-dialog.tsx
// Dialog form for creating/editing a Team Member (team_members & team_member_translations)
// Strictly matching DB Schema
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
import { ImageUploader } from "@shared/upload/image-uploader";
import type { TeamMemberEntity } from "../../domain/entities/about.entity";

const teamMemberSchema = z.object({
  photoUrl: z.string().optional().nullable(),
  nameEn: z.string().min(1, "English name is required"),
  nameAr: z.string().optional().nullable(),
  nameKu: z.string().optional().nullable(),
  positionEn: z.string().optional().nullable(),
  positionAr: z.string().optional().nullable(),
  positionKu: z.string().optional().nullable(),
  bioEn: z.string().optional().nullable(),
  bioAr: z.string().optional().nullable(),
  bioKu: z.string().optional().nullable(),
  sortOrder: z.number().min(0),
  status: z.enum(["active", "draft"]),
});

export type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

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
      photoUrl: "",
      nameEn: "",
      nameAr: "",
      nameKu: "",
      positionEn: "",
      positionAr: "",
      positionKu: "",
      bioEn: "",
      bioAr: "",
      bioKu: "",
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
        photoUrl: initialData.photoUrl ?? "",
        nameEn: en.name || "",
        nameAr: ar.name || "",
        nameKu: ku.name || "",
        positionEn: en.position || "",
        positionAr: ar.position || "",
        positionKu: ku.position || "",
        bioEn: en.bio || "",
        bioAr: ar.bio || "",
        bioKu: ku.bio || "",
        sortOrder: initialData.sortOrder,
        status: initialData.status,
      });
    } else {
      reset({
        photoUrl: "",
        nameEn: "",
        nameAr: "",
        nameKu: "",
        positionEn: "",
        positionAr: "",
        positionKu: "",
        bioEn: "",
        bioAr: "",
        bioKu: "",
        sortOrder: 1,
        status: "active",
      });
    }
  }, [initialData, reset, isOpen]);

  const photoUrl = watch("photoUrl");
  const status = watch("status");

  const onFormSubmit = async (values: TeamMemberFormValues) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Team Member" : "Add Team Member"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
          {/* Photo Uploader */}
          <div className="space-y-1">
            <Label>Photo</Label>
            <ImageUploader
              value={photoUrl ?? null}
              onChange={(url) => setValue("photoUrl", url ?? null)}
              folder="team"
            />
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="nameEn">Name (EN) *</Label>
              <Input id="nameEn" {...register("nameEn")} placeholder="John Doe" />
              {errors.nameEn && <span className="text-xs text-destructive">{errors.nameEn.message}</span>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="nameAr">Name (AR)</Label>
              <Input id="nameAr" dir="rtl" {...register("nameAr")} placeholder="جون دو" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="nameKu">Name (KU)</Label>
              <Input id="nameKu" dir="rtl" {...register("nameKu")} placeholder="جۆن دۆ" />
            </div>
          </div>

          {/* Positions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="positionEn">Position (EN)</Label>
              <Input id="positionEn" {...register("positionEn")} placeholder="Chief Executive Officer" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="positionAr">Position (AR)</Label>
              <Input id="positionAr" dir="rtl" {...register("positionAr")} placeholder="الرئيس التنفيذي" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="positionKu">Position (KU)</Label>
              <Input id="positionKu" dir="rtl" {...register("positionKu")} placeholder="بەڕێوەبەری جێبەجێکار" />
            </div>
          </div>

          {/* Bios */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="bioEn">Bio (EN)</Label>
              <Textarea id="bioEn" rows={3} {...register("bioEn")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="bioAr">Bio (AR)</Label>
              <Textarea id="bioAr" rows={3} dir="rtl" {...register("bioAr")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="bioKu">Bio (KU)</Label>
              <Textarea id="bioKu" rows={3} dir="rtl" {...register("bioKu")} />
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Save Changes" : "Create Team Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
