"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Loader2, Save, ArrowLeft, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { ImageUploader } from "@shared/upload/image-uploader";
import { useCreateTeamMember, useUpdateTeamMember } from "@shared/hooks/team/use-team-hooks";
import type { TeamMemberEntity } from "../../domain/entities/team-member.entity";

const teamMemberSchema = z.object({
  fullNameEn: z.string().min(2, "English full name is required"),
  fullNameAr: z.string().optional().nullable(),
  fullNameKu: z.string().optional().nullable(),
  positionEn: z.string().optional().nullable(),
  positionAr: z.string().optional().nullable(),
  positionKu: z.string().optional().nullable(),
  biographyEn: z.string().optional().nullable(),
  biographyAr: z.string().optional().nullable(),
  biographyKu: z.string().optional().nullable(),
  photo: z.string().optional().nullable(),
  status: z.enum(["active", "draft"]),
  sortOrder: z.number().min(0),
});

export type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

interface TeamMemberFormProps {
  initialData?: TeamMemberEntity | null;
}

export function TeamMemberForm({ initialData }: TeamMemberFormProps) {
  const tForm = useTranslations("teamForm");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const isEditing = !!initialData;

  const createTeamMemberMutation = useCreateTeamMember();
  const updateTeamMemberMutation = useUpdateTeamMember();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      fullNameEn: "",
      fullNameAr: "",
      fullNameKu: "",
      positionEn: "",
      positionAr: "",
      positionKu: "",
      biographyEn: "",
      biographyAr: "",
      biographyKu: "",
      photo: null,
      status: "active",
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        fullNameEn: initialData.fullNameEn ?? "",
        fullNameAr: initialData.fullNameAr ?? "",
        fullNameKu: initialData.fullNameKu ?? "",
        positionEn: initialData.positionEn ?? "",
        positionAr: initialData.positionAr ?? "",
        positionKu: initialData.positionKu ?? "",
        biographyEn: initialData.biographyEn ?? "",
        biographyAr: initialData.biographyAr ?? "",
        biographyKu: initialData.biographyKu ?? "",
        photo: initialData.photo ?? null,
        status: initialData.status ?? "active",
        sortOrder: initialData.sortOrder ?? 0,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (values: TeamMemberFormValues) => {
    try {
      if (isEditing && initialData) {
        await updateTeamMemberMutation.mutateAsync({
          id: initialData.id,
          ...values,
        });
      } else {
        await createTeamMemberMutation.mutateAsync(values);
      }
      router.push("/admin/team");
    } catch {
      // Toast notifications handled in mutations
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.push("/admin/team")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditing ? `${tForm("editTitle")}: ${initialData.fullNameEn}` : tForm("createTitle")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEditing ? tForm("editSubtitle") : tForm("createSubtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/team")}
            disabled={isSubmitting}
          >
            {tForm("cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2 min-w-[140px]">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {tForm("saving")}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> {isEditing ? tForm("updateBtn") : tForm("saveBtn")}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Translatable Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {tForm("contentTitle")}
              </CardTitle>
              <CardDescription>
                {tForm("contentSubtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MultilingualTabs
                englishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullNameEn">{tForm("nameEn")} *</Label>
                      <Input
                        id="fullNameEn"
                        {...register("fullNameEn")}
                      />
                      {errors.fullNameEn && (
                        <p className="text-xs font-semibold text-destructive">{errors.fullNameEn.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="positionEn">{tForm("positionEn")}</Label>
                      <Input
                        id="positionEn"
                        {...register("positionEn")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="biographyEn">{tForm("bioEn")}</Label>
                      <Textarea
                        id="biographyEn"
                        className="min-h-[140px]"
                        {...register("biographyEn")}
                      />
                    </div>
                  </div>
                }
                arabicFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullNameAr">{tForm("nameAr")}</Label>
                      <Input
                        id="fullNameAr"
                        dir="rtl"
                        {...register("fullNameAr")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="positionAr">{tForm("positionAr")}</Label>
                      <Input
                        id="positionAr"
                        dir="rtl"
                        {...register("positionAr")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="biographyAr">{tForm("bioAr")}</Label>
                      <Textarea
                        id="biographyAr"
                        dir="rtl"
                        className="min-h-[140px]"
                        {...register("biographyAr")}
                      />
                    </div>
                  </div>
                }
                kurdishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullNameKu">{tForm("nameKu")}</Label>
                      <Input
                        id="fullNameKu"
                        dir="rtl"
                        {...register("fullNameKu")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="positionKu">{tForm("positionKu")}</Label>
                      <Input
                        id="positionKu"
                        dir="rtl"
                        {...register("positionKu")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="biographyKu">{tForm("bioKu")}</Label>
                      <Textarea
                        id="biographyKu"
                        dir="rtl"
                        className="min-h-[140px]"
                        {...register("biographyKu")}
                      />
                    </div>
                  </div>
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          {/* Status & Ordering */}
          <Card>
            <CardHeader>
              <CardTitle>{tForm("statusTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">{tForm("status")}</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(val) => setValue("status", val as "active" | "draft")}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{tCommon("active")}</SelectItem>
                    <SelectItem value="draft">{tCommon("draft")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder">{tForm("sortOrder")}</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min={0}
                  {...register("sortOrder", { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Photo Upload (team-photos bucket) */}
          <Card>
            <CardHeader>
              <CardTitle>{tForm("photoTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                value={watch("photo") ?? ""}
                onChange={(url) => setValue("photo", url)}
                bucket="team-photos"
                folder="members"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
