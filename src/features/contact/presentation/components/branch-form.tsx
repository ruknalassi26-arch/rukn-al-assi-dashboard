"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Loader2, Save, ArrowLeft, Building2, MapPin, Phone, Mail, MessageSquare } from "lucide-react";
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
import { useCreateBranch, useUpdateBranch } from "@shared/hooks/contact/use-contact-hooks";
import type { BranchEntity } from "../../domain/entities/branch.entity";

const branchSchema = z.object({
  nameEn: z.string().min(2, "English branch name is required"),
  nameAr: z.string().min(2, "Arabic branch name is required"),
  nameKu: z.string().optional().nullable(),
  addressEn: z.string().optional().nullable(),
  addressAr: z.string().optional().nullable(),
  addressKu: z.string().optional().nullable(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")).nullable(),
  phone: z.string().optional().nullable(),
  whatsappNumber: z.string().optional().nullable(),
  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .optional()
    .or(z.nan())
    .nullable(),
  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .optional()
    .or(z.nan())
    .nullable(),
  status: z.enum(["published", "draft", "archived", "active"]),
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
      email: "",
      phone: "",
      whatsappNumber: "",
      latitude: undefined,
      longitude: undefined,
      status: "published",
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
        email: initialData.email ?? "",
        phone: initialData.phone ?? "",
        whatsappNumber: initialData.whatsappNumber ?? "",
        latitude: initialData.latitude ?? undefined,
        longitude: initialData.longitude ?? undefined,
        status: initialData.status === "active" ? "published" : initialData.status,
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
      router.push("/admin/branches");
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
            onClick={() => router.push("/admin/branches")}
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
            onClick={() => router.push("/admin/branches")}
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
                        placeholder="e.g. Erbil Main Branch"
                        {...register("nameEn")}
                      />
                      {errors.nameEn && (
                        <p className="text-xs font-semibold text-destructive">{errors.nameEn.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressEn">{tForm("addressEn")}</Label>
                      <Textarea
                        id="addressEn"
                        placeholder="e.g. 100 Meter Street, Industrial Zone, Erbil"
                        className="min-h-[90px]"
                        {...register("addressEn")}
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
                        placeholder="مثال: الفرع الرئيسي - أربيل"
                        {...register("nameAr")}
                      />
                      {errors.nameAr && (
                        <p className="text-xs font-semibold text-destructive">{errors.nameAr.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressAr">{tForm("addressAr")}</Label>
                      <Textarea
                        id="addressAr"
                        dir="rtl"
                        placeholder="مثال: شارع 100 متري، المنطقة الصناعية، أربيل"
                        className="min-h-[90px]"
                        {...register("addressAr")}
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
                        placeholder="نموونە: لقی سەرەکی هەولێر"
                        {...register("nameKu")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressKu">{tForm("addressKu")}</Label>
                      <Textarea
                        id="addressKu"
                        dir="rtl"
                        placeholder="نموونە: شەقامی ١٠٠ مەتری، ناوچەی پیشەسازی، هەولێر"
                        className="min-h-[90px]"
                        {...register("addressKu")}
                      />
                    </div>
                  </div>
                }
              />
            </CardContent>
          </Card>

          {/* Map Coordinates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Map Coordinates
              </CardTitle>
              <CardDescription>
                Specify GPS latitude and longitude coordinates for map location pin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude (map_lat)</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="e.g. 36.1911"
                    {...register("latitude", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude (map_lng)</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="e.g. 44.0091"
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
                  value={watch("status") === "active" ? "published" : watch("status")}
                  onValueChange={(val) => setValue("status", val as "published" | "draft")}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">{tCommon("active")}</SelectItem>
                    <SelectItem value="draft">{tCommon("draft")}</SelectItem>
                  </SelectContent>
                </Select>
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
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Branch Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {tForm("email")}
                </Label>
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
                <Label htmlFor="phone" className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {tForm("phone")}
                </Label>
                <Input
                  id="phone"
                  placeholder="+964 750 000 0000"
                  {...register("phone")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappNumber" className="flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-emerald-500" />
                  WhatsApp Number
                </Label>
                <Input
                  id="whatsappNumber"
                  placeholder="+964 750 000 0000"
                  {...register("whatsappNumber")}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
