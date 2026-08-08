"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
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
  const tForm = useTranslations("branchForm");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const isEditing = !!initialData;

  const createBranchMutation = useCreateBranch();
  const updateBranchMutation = useUpdateBranch();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      nameEn: "",
      nameAr: "",
      nameKu: "",
      addressEn: "",
      addressAr: "",
      addressKu: "",
      cityEn: "",
      cityAr: "",
      cityKu: "",
      email: "",
      phone: "",
      googleMapsUrl: "",
      latitude: 0,
      longitude: 0,
      workingHoursEn: "",
      workingHoursAr: "",
      workingHoursKu: "",
      isHeadquarters: false,
      status: "active",
      sortOrder: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nameEn: initialData.nameEn,
        nameAr: initialData.nameAr,
        nameKu: initialData.nameKu ?? "",
        addressEn: initialData.addressEn ?? "",
        addressAr: initialData.addressAr ?? "",
        addressKu: initialData.addressKu ?? "",
        cityEn: initialData.cityEn ?? "",
        cityAr: initialData.cityAr ?? "",
        cityKu: initialData.cityKu ?? "",
        email: initialData.email ?? "",
        phone: initialData.phone ?? "",
        googleMapsUrl: initialData.googleMapsUrl ?? "",
        latitude: initialData.latitude ?? 0,
        longitude: initialData.longitude ?? 0,
        workingHoursEn: initialData.workingHoursEn ?? "",
        workingHoursAr: initialData.workingHoursAr ?? "",
        workingHoursKu: initialData.workingHoursKu ?? "",
        isHeadquarters: initialData.isHeadquarters,
        status: initialData.status,
        sortOrder: initialData.sortOrder,
      });
    }
  }, [initialData, reset]);

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
              {isEditing ? `${tForm("editTitle")}: ${initialData.nameEn}` : tForm("createTitle")}
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
            onClick={() => router.push("/admin/contact")}
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
                <Building2 className="h-5 w-5 text-primary" />
                {tForm("detailsTitle")}
              </CardTitle>
              <CardDescription>
                {tForm("detailsSubtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MultilingualTabs
                englishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameEn">{tForm("nameEn")} *</Label>
                      <Input
                        id="nameEn"
                        {...register("nameEn")}
                      />
                      {errors.nameEn && (
                        <p className="text-xs font-semibold text-destructive">{errors.nameEn.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cityEn">{tForm("cityEn")}</Label>
                      <Input
                        id="cityEn"
                        {...register("cityEn")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressEn">{tForm("addressEn")}</Label>
                      <Textarea
                        id="addressEn"
                        className="min-h-[80px]"
                        {...register("addressEn")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workingHoursEn">{tForm("hoursEn")}</Label>
                      <Input
                        id="workingHoursEn"
                        {...register("workingHoursEn")}
                      />
                    </div>
                  </div>
                }
                arabicFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameAr">{tForm("nameAr")} *</Label>
                      <Input
                        id="nameAr"
                        dir="rtl"
                        {...register("nameAr")}
                      />
                      {errors.nameAr && (
                        <p className="text-xs font-semibold text-destructive">{errors.nameAr.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cityAr">{tForm("cityAr")}</Label>
                      <Input
                        id="cityAr"
                        dir="rtl"
                        {...register("cityAr")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressAr">{tForm("addressAr")}</Label>
                      <Textarea
                        id="addressAr"
                        dir="rtl"
                        className="min-h-[80px]"
                        {...register("addressAr")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workingHoursAr">{tForm("hoursAr")}</Label>
                      <Input
                        id="workingHoursAr"
                        dir="rtl"
                        {...register("workingHoursAr")}
                      />
                    </div>
                  </div>
                }
                kurdishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameKu">{tForm("nameKu")}</Label>
                      <Input
                        id="nameKu"
                        dir="rtl"
                        {...register("nameKu")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cityKu">{tForm("cityKu")}</Label>
                      <Input
                        id="cityKu"
                        dir="rtl"
                        {...register("cityKu")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressKu">{tForm("addressKu")}</Label>
                      <Textarea
                        id="addressKu"
                        dir="rtl"
                        className="min-h-[80px]"
                        {...register("addressKu")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workingHoursKu">{tForm("hoursKu")}</Label>
                      <Input
                        id="workingHoursKu"
                        dir="rtl"
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
              <CardTitle>{tForm("mapTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleMapsUrl">{tForm("googleMapsUrl")}</Label>
                <Input
                  id="googleMapsUrl"
                  placeholder="https://maps.google.com/..."
                  {...register("googleMapsUrl")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">{tForm("latitude")}</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    {...register("latitude", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">{tForm("longitude")}</Label>
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

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="isHeadquarters"
                  checked={watch("isHeadquarters")}
                  onCheckedChange={(checked) => setValue("isHeadquarters", !!checked)}
                />
                <Label htmlFor="isHeadquarters" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {tForm("mainHq")}
                </Label>
              </div>

              <div className="space-y-2 pt-2">
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

          {/* Branch Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle>{tForm("contactTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{tForm("email")}</Label>
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
                <Label htmlFor="phone">{tForm("phone")}</Label>
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
