"use client";
// ==============================================================================
// features/team/presentation/components/team-member-form.tsx
// Team Member Creation / Editing Form with RHF + Zod + MultilingualTabs
// ==============================================================================
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  fullNameAr: z.string().min(2, "Arabic full name is required"),
  fullNameKu: z.string().optional().nullable(),
  positionEn: z.string().optional().nullable(),
  positionAr: z.string().optional().nullable(),
  positionKu: z.string().optional().nullable(),
  departmentEn: z.string().optional().nullable(),
  departmentAr: z.string().optional().nullable(),
  departmentKu: z.string().optional().nullable(),
  biographyEn: z.string().optional().nullable(),
  biographyAr: z.string().optional().nullable(),
  biographyKu: z.string().optional().nullable(),
  photo: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")).nullable(),
  phone: z.string().optional().nullable(),
  status: z.enum(["active", "draft"]),
  sortOrder: z.number().min(0),
});

export type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

interface TeamMemberFormProps {
  initialData?: TeamMemberEntity | null;
}

export function TeamMemberForm({ initialData }: TeamMemberFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const createTeamMemberMutation = useCreateTeamMember();
  const updateTeamMemberMutation = useUpdateTeamMember();
  const isSubmitting = createTeamMemberMutation.isPending || updateTeamMemberMutation.isPending;

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      fullNameEn: initialData?.fullNameEn ?? "",
      fullNameAr: initialData?.fullNameAr ?? "",
      fullNameKu: initialData?.fullNameKu ?? "",
      positionEn: initialData?.positionEn ?? "",
      positionAr: initialData?.positionAr ?? "",
      positionKu: initialData?.positionKu ?? "",
      departmentEn: initialData?.departmentEn ?? "",
      departmentAr: initialData?.departmentAr ?? "",
      departmentKu: initialData?.departmentKu ?? "",
      biographyEn: initialData?.biographyEn ?? "",
      biographyAr: initialData?.biographyAr ?? "",
      biographyKu: initialData?.biographyKu ?? "",
      photo: initialData?.photo ?? "",
      linkedin: initialData?.linkedin ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
      status: initialData?.status ?? "active",
      sortOrder: initialData?.sortOrder ?? 0,
    },
  });

  const { watch, setValue, register, handleSubmit, formState: { errors } } = form;

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
              {isEditing ? `Edit Team Member: ${initialData.fullNameEn}` : "Add New Team Member"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage leadership, executives, and company personnel profiles.
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
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2 min-w-[140px]">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> {isEditing ? "Update Profile" : "Save Member"}
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
                Member Multilingual Profile
              </CardTitle>
              <CardDescription>
                Provide full name, position title, department, and biography in English, Arabic, and Kurdish Sorani.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MultilingualTabs
                englishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullNameEn">Full Name (English) *</Label>
                      <Input
                        id="fullNameEn"
                        placeholder="e.g. Johnathan Smith"
                        {...register("fullNameEn")}
                      />
                      {errors.fullNameEn && (
                        <p className="text-xs font-semibold text-destructive">{errors.fullNameEn.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="positionEn">Job Position / Title (English)</Label>
                      <Input
                        id="positionEn"
                        placeholder="e.g. Chief Executive Officer"
                        {...register("positionEn")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="departmentEn">Department (English)</Label>
                      <Input
                        id="departmentEn"
                        placeholder="e.g. Executive Management / Engineering"
                        {...register("departmentEn")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="biographyEn">Biography (English)</Label>
                      <Textarea
                        id="biographyEn"
                        placeholder="Professional bio and background summary..."
                        className="min-h-[140px]"
                        {...register("biographyEn")}
                      />
                    </div>
                  </div>
                }
                arabicFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullNameAr">الاسم الكامل (بالعربية) *</Label>
                      <Input
                        id="fullNameAr"
                        placeholder="مثال: جونثان سميث"
                        {...register("fullNameAr")}
                      />
                      {errors.fullNameAr && (
                        <p className="text-xs font-semibold text-destructive">{errors.fullNameAr.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="positionAr">المسمى الوظيفي (بالعربية)</Label>
                      <Input
                        id="positionAr"
                        placeholder="مثال: الرئيس التنفيذي"
                        {...register("positionAr")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="departmentAr">القسم / الإدارة (بالعربية)</Label>
                      <Input
                        id="departmentAr"
                        placeholder="مثال: الإدارة العليا / قسم الهندسة"
                        {...register("departmentAr")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="biographyAr">السيرة الذاتية (بالعربية)</Label>
                      <Textarea
                        id="biographyAr"
                        placeholder="نبذة عن المؤهلات والخبرات..."
                        className="min-h-[140px]"
                        {...register("biographyAr")}
                      />
                    </div>
                  </div>
                }
                kurdishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullNameKu">ناوی تەواو (بە کوردی)</Label>
                      <Input
                        id="fullNameKu"
                        placeholder="ناوی سیانی بە کوردی"
                        {...register("fullNameKu")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="positionKu">پۆستی کار (بە کوردی)</Label>
                      <Input
                        id="positionKu"
                        placeholder="نموونە: بەڕێوەبەری جێبەجێکار"
                        {...register("positionKu")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="departmentKu">بەش / بەڕێوەبەرایەتی (بە کوردی)</Label>
                      <Input
                        id="departmentKu"
                        placeholder="نموونە: بەشی ئەندازیاری"
                        {...register("departmentKu")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="biographyKu">ژیاننامە (بە کوردی)</Label>
                      <Textarea
                        id="biographyKu"
                        placeholder="پوختەی ئەزموون و کارەکان..."
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
              <CardTitle>Status & Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Publishing Status</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(val) => setValue("status", val as "active" | "draft")}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active (Visible)</SelectItem>
                    <SelectItem value="draft">Draft (Hidden)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder">Display Order (Sort Order)</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min={0}
                  {...register("sortOrder", { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs font-semibold text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+964 7XX XXX XXXX"
                  {...register("phone")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  {...register("linkedin")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Photo Upload (team-photos bucket) */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                value={watch("photo") ?? ""}
                onChange={(url) => setValue("photo", url)}
                folder="team-photos"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
