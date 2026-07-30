"use client";
// ==============================================================================
// features/contact/presentation/components/branch-form.tsx
// Branch Creation / Editing Form with RHF + Zod + MultilingualTabs
// ==============================================================================
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, ArrowLeft, Building2 } from "lucide-react";
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
  Checkbox,
} from "@shared/ui";
import { MultilingualTabs } from "@shared/components/multilingual-tabs";
import { useCreateBranch, useUpdateBranch } from "@shared/hooks/contact/use-contact-hooks";
import type { BranchEntity } from "../../domain/entities/branch.entity";

const branchSchema = z.object({
  nameEn: z.string().min(2, "English branch name is required"),
  nameAr: z.string().min(2, "Arabic branch name is required"),
  nameKu: z.string().optional().nullable(),
  addressEn: z.string().optional().nullable(),
  addressAr: z.string().optional().nullable(),
  addressKu: z.string().optional().nullable(),
  cityEn: z.string().optional().nullable(),
  cityAr: z.string().optional().nullable(),
  cityKu: z.string().optional().nullable(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")).nullable(),
  phone: z.string().optional().nullable(),
  googleMapsUrl: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  workingHoursEn: z.string().optional().nullable(),
  workingHoursAr: z.string().optional().nullable(),
  workingHoursKu: z.string().optional().nullable(),
  isHeadquarters: z.boolean(),
  status: z.enum(["active", "draft"]),
  sortOrder: z.number().min(0),
});

export type BranchFormValues = z.infer<typeof branchSchema>;

interface BranchFormProps {
  initialData?: BranchEntity | null;
}

export function BranchForm({ initialData }: BranchFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const createBranchMutation = useCreateBranch();
  const updateBranchMutation = useUpdateBranch();
  const isSubmitting = createBranchMutation.isPending || updateBranchMutation.isPending;

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      nameEn: initialData?.nameEn ?? "",
      nameAr: initialData?.nameAr ?? "",
      nameKu: initialData?.nameKu ?? "",
      addressEn: initialData?.addressEn ?? "",
      addressAr: initialData?.addressAr ?? "",
      addressKu: initialData?.addressKu ?? "",
      cityEn: initialData?.cityEn ?? "",
      cityAr: initialData?.cityAr ?? "",
      cityKu: initialData?.cityKu ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
      googleMapsUrl: initialData?.googleMapsUrl ?? "",
      latitude: initialData?.latitude ?? 0,
      longitude: initialData?.longitude ?? 0,
      workingHoursEn: initialData?.workingHoursEn ?? "",
      workingHoursAr: initialData?.workingHoursAr ?? "",
      workingHoursKu: initialData?.workingHoursKu ?? "",
      isHeadquarters: initialData?.isHeadquarters ?? false,
      status: initialData?.status ?? "active",
      sortOrder: initialData?.sortOrder ?? 0,
    },
  });

  const { watch, setValue, register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (values: BranchFormValues) => {
    try {
      if (isEditing && initialData) {
        await updateBranchMutation.mutateAsync({
          id: initialData.id,
          ...values,
        });
      } else {
        await createBranchMutation.mutateAsync(values);
      }
      router.push("/admin/contact");
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
            onClick={() => router.push("/admin/contact")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditing ? `Edit Branch: ${initialData.nameEn}` : "Add New Branch"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage regional office locations, branch phone numbers, and addresses.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/contact")}
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
                <Save className="h-4 w-4" /> {isEditing ? "Update Branch" : "Save Branch"}
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
                <Building2 className="h-5 w-5 text-primary" />
                Multilingual Branch Details
              </CardTitle>
              <CardDescription>
                Provide branch name, city, full address, and working hours in English, Arabic, and Kurdish Sorani.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MultilingualTabs
                englishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameEn">Branch Name (English) *</Label>
                      <Input
                        id="nameEn"
                        placeholder="e.g. Erbil Main Showroom"
                        {...register("nameEn")}
                      />
                      {errors.nameEn && (
                        <p className="text-xs font-semibold text-destructive">{errors.nameEn.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cityEn">City / Region (English)</Label>
                      <Input
                        id="cityEn"
                        placeholder="e.g. Erbil / Baghdad"
                        {...register("cityEn")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressEn">Street Address (English)</Label>
                      <Textarea
                        id="addressEn"
                        placeholder="Full street address..."
                        className="min-h-[80px]"
                        {...register("addressEn")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workingHoursEn">Working Hours (English)</Label>
                      <Input
                        id="workingHoursEn"
                        placeholder="e.g. 8:00 AM - 5:00 PM"
                        {...register("workingHoursEn")}
                      />
                    </div>
                  </div>
                }
                arabicFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameAr">اسم الفرع (بالعربية) *</Label>
                      <Input
                        id="nameAr"
                        placeholder="مثال: معرض أربيل الرئيسي"
                        {...register("nameAr")}
                      />
                      {errors.nameAr && (
                        <p className="text-xs font-semibold text-destructive">{errors.nameAr.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cityAr">المدينة / المنطقة (بالعربية)</Label>
                      <Input
                        id="cityAr"
                        placeholder="مثال: أربيل / بغداد"
                        {...register("cityAr")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressAr">العنوان التفصيلي (بالعربية)</Label>
                      <Textarea
                        id="addressAr"
                        placeholder="عنوان الشارع والمقر بالتفصيل..."
                        className="min-h-[80px]"
                        {...register("addressAr")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workingHoursAr">أوقات العمل (بالعربية)</Label>
                      <Input
                        id="workingHoursAr"
                        placeholder="مثال: 8:00 صباحاً - 5:00 مساءً"
                        {...register("workingHoursAr")}
                      />
                    </div>
                  </div>
                }
                kurdishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameKu">ناوی لقی کار (بە کوردی)</Label>
                      <Input
                        id="nameKu"
                        placeholder="نموونە: پیشانگەى سەرەکى هەولێر"
                        {...register("nameKu")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cityKu">شار / ناوچە (بە کوردی)</Label>
                      <Input
                        id="cityKu"
                        placeholder="نموونە: هەولێر / بەغدا"
                        {...register("cityKu")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressKu">ناونیشانی شەقام (بە کوردی)</Label>
                      <Textarea
                        id="addressKu"
                        placeholder="ناونیشانی تەواوی لقی کار..."
                        className="min-h-[80px]"
                        {...register("addressKu")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workingHoursKu">کاتەکانی کارکردن (بە کوردی)</Label>
                      <Input
                        id="workingHoursKu"
                        placeholder="نموونە: ٨:٠٠ی بەیانی - ٥:٠٠ی ئێوارە"
                        {...register("workingHoursKu")}
                      />
                    </div>
                  </div>
                }
              />
            </CardContent>
          </Card>

          {/* Location Coordinates & Maps */}
          <Card>
            <CardHeader>
              <CardTitle>Map Location & Coordinates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
                <Input
                  id="googleMapsUrl"
                  placeholder="https://maps.google.com/..."
                  {...register("googleMapsUrl")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    {...register("latitude", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    {...register("longitude", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Branch Status & Settings</CardTitle>
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

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="isHeadquarters"
                  checked={watch("isHeadquarters")}
                  onCheckedChange={(checked) => setValue("isHeadquarters", !!checked)}
                />
                <Label htmlFor="isHeadquarters" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Mark as Main Headquarters
                </Label>
              </div>

              <div className="space-y-2 pt-2">
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

          {/* Branch Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle>Direct Branch Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Branch Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="erbil@company.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs font-semibold text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Branch Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+964 7XX XXX XXXX"
                  {...register("phone")}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
