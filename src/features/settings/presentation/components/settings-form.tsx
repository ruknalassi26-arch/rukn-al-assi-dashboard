"use client";
// ==============================================================================
// features/settings/presentation/components/settings-form.tsx
// Comprehensive Website Settings & Branding Form Component
// ==============================================================================
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Save,
  Globe,
  Building2,
  Phone,
  Share2,
  Image as ImageIcon,
  MapPin,
  Mail,
  Clock,
  Briefcase,
  Calendar,
  Compass,
  Target,
} from "lucide-react";
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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Skeleton,
} from "@shared/ui";
import { MultilingualTabs } from "@shared/components/multilingual-tabs";
import { ImageUploader } from "@shared/upload/image-uploader";
import { useWebsiteSettings, useUpdateWebsiteSettings } from "@shared/hooks/settings/use-settings-hooks";
import { LanguageListTable } from "@features/languages/presentation/components/language-list-table";
import { ErrorState } from "@shared/components/error-state";
import { useSettingsStore, type SettingsTab } from "../stores/settings.store";

const settingsSchema = z.object({
  companyNameEn: z.string().min(2, "Company English name is required"),
  companyNameAr: z.string().min(2, "Company Arabic name is required"),
  companyNameKu: z.string().optional().nullable(),
  taglineEn: z.string().optional().nullable(),
  taglineAr: z.string().optional().nullable(),
  taglineKu: z.string().optional().nullable(),

  legalNameEn: z.string().optional().nullable(),
  legalNameAr: z.string().optional().nullable(),
  legalNameKu: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  descriptionKu: z.string().optional().nullable(),
  registrationInfoEn: z.string().optional().nullable(),
  registrationInfoAr: z.string().optional().nullable(),
  registrationInfoKu: z.string().optional().nullable(),
  industryEn: z.string().optional().nullable(),
  industryAr: z.string().optional().nullable(),
  industryKu: z.string().optional().nullable(),
  foundedYear: z.string().optional().nullable(),
  missionEn: z.string().optional().nullable(),
  missionAr: z.string().optional().nullable(),
  missionKu: z.string().optional().nullable(),
  visionEn: z.string().optional().nullable(),
  visionAr: z.string().optional().nullable(),
  visionKu: z.string().optional().nullable(),

  email: z.string().email("Invalid email address").optional().or(z.literal("")).nullable(),
  phone: z.string().optional().nullable(),
  phoneSecondary: z.string().optional().nullable(),
  addressEn: z.string().optional().nullable(),
  addressAr: z.string().optional().nullable(),
  addressKu: z.string().optional().nullable(),
  googleMapsUrl: z.string().optional().nullable(),
  latitude: z.union([z.number(), z.nan()]).optional().nullable(),
  longitude: z.union([z.number(), z.nan()]).optional().nullable(),
  workingHoursEn: z.string().optional().nullable(),
  workingHoursAr: z.string().optional().nullable(),
  workingHoursKu: z.string().optional().nullable(),

  facebookUrl: z.string().optional().nullable(),
  twitterUrl: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  youtubeUrl: z.string().optional().nullable(),
  whatsappNumber: z.string().optional().nullable(),

  logoUrl: z.string().optional().nullable(),
  logoDarkUrl: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
  ogImageUrl: z.string().optional().nullable(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsForm() {
  const { activeTab, setActiveTab } = useSettingsStore();
  const { data: settings, isLoading, error, refetch } = useWebsiteSettings();
  const updateSettingsMutation = useUpdateWebsiteSettings();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    values: {
      companyNameEn: settings?.companyNameEn ?? "Rukn Al Assi Co.",
      companyNameAr: settings?.companyNameAr ?? "شركة ركن العاصي",
      companyNameKu: settings?.companyNameKu ?? "",
      taglineEn: settings?.taglineEn ?? "Engineering & Hydraulic Solutions",
      taglineAr: settings?.taglineAr ?? "حلول الهندسة والهيدروليك المتقدمة",
      taglineKu: settings?.taglineKu ?? "",

      legalNameEn: settings?.legalNameEn ?? "Rukn Al Assi General Trading & Contracting Ltd.",
      legalNameAr: settings?.legalNameAr ?? "شركة ركن العاصي للتجارة والمقاولات العامة المحدودة",
      legalNameKu: settings?.legalNameKu ?? "",
      descriptionEn: settings?.descriptionEn ?? "Leading supplier and integrator of high-performance hydraulic systems, heavy industrial components, and engineering services.",
      descriptionAr: settings?.descriptionAr ?? "المزود والمورد الرائد للأنظمة الهيدروليكية عالية الأداء والمكونات الصناعية والخدمات الهندسية.",
      descriptionKu: settings?.descriptionKu ?? "",
      registrationInfoEn: settings?.registrationInfoEn ?? "",
      registrationInfoAr: settings?.registrationInfoAr ?? "",
      registrationInfoKu: settings?.registrationInfoKu ?? "",
      industryEn: settings?.industryEn ?? "Industrial Engineering & Hydraulics",
      industryAr: settings?.industryAr ?? "الهندسة الصناعية والأنظمة الهيدروليكية",
      industryKu: settings?.industryKu ?? "",
      foundedYear: settings?.foundedYear ?? "2008",
      missionEn: settings?.missionEn ?? "",
      missionAr: settings?.missionAr ?? "",
      missionKu: settings?.missionKu ?? "",
      visionEn: settings?.visionEn ?? "",
      visionAr: settings?.visionAr ?? "",
      visionKu: settings?.visionKu ?? "",

      email: settings?.email ?? "info@ruknalassi.com",
      phone: settings?.phone ?? "",
      phoneSecondary: settings?.phoneSecondary ?? "",
      addressEn: settings?.addressEn ?? "",
      addressAr: settings?.addressAr ?? "",
      addressKu: settings?.addressKu ?? "",
      googleMapsUrl: settings?.googleMapsUrl ?? "",
      latitude: settings?.latitude ?? 0,
      longitude: settings?.longitude ?? 0,
      workingHoursEn: settings?.workingHoursEn ?? "Mon - Sat: 8:00 AM - 6:00 PM",
      workingHoursAr: settings?.workingHoursAr ?? "الإثنين - السبت: 8:00 صباحاً - 6:00 مساءً",
      workingHoursKu: settings?.workingHoursKu ?? "",

      facebookUrl: settings?.facebookUrl ?? "",
      twitterUrl: settings?.twitterUrl ?? "",
      linkedinUrl: settings?.linkedinUrl ?? "",
      instagramUrl: settings?.instagramUrl ?? "",
      youtubeUrl: settings?.youtubeUrl ?? "",
      whatsappNumber: settings?.whatsappNumber ?? "",

      logoUrl: settings?.logoUrl ?? "",
      logoDarkUrl: settings?.logoDarkUrl ?? "",
      faviconUrl: settings?.faviconUrl ?? "",
      ogImageUrl: settings?.ogImageUrl ?? "",
    },
  });

  const { watch, setValue, register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (values: SettingsFormValues) => {
    await updateSettingsMutation.mutateAsync(values);
  };

  if (isLoading) {
    return (
      <Card className="max-w-5xl mx-auto">
        <CardHeader><Skeleton className="h-8 w-64" /></CardHeader>
        <CardContent className="space-y-4"><Skeleton className="h-64 w-full" /></CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load website settings"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Website Settings & Branding</h1>
          <p className="text-sm text-muted-foreground">
            Configure global website settings, multilingual identity, contact channels, social profiles, and branding assets.
          </p>
        </div>

        <Button type="submit" disabled={updateSettingsMutation.isPending} className="gap-2 min-w-[140px]">
          {updateSettingsMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save Settings
            </>
          )}
        </Button>
      </div>

      {/* Main Tabbed Layout */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as SettingsTab)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6 h-auto p-1 bg-muted/60 border rounded-lg">
          <TabsTrigger value="general" className="gap-1.5 py-2 text-xs font-semibold">
            <Globe className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="languages" className="gap-1.5 py-2 text-xs font-semibold">
            <Globe className="h-4 w-4" /> Languages
          </TabsTrigger>
          <TabsTrigger value="company" className="gap-1.5 py-2 text-xs font-semibold">
            <Building2 className="h-4 w-4" /> Company
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-1.5 py-2 text-xs font-semibold">
            <Phone className="h-4 w-4" /> Contact Info
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-1.5 py-2 text-xs font-semibold">
            <Share2 className="h-4 w-4" /> Social Media
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-1.5 py-2 text-xs font-semibold">
            <ImageIcon className="h-4 w-4" /> Branding
          </TabsTrigger>
        </TabsList>

        {/* 1. General Settings Tab */}
        <TabsContent value="general" className="focus-visible:outline-none space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                General Multilingual Identity
              </CardTitle>
              <CardDescription>
                Set the official company name and taglines across supported system languages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MultilingualTabs
                englishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyNameEn">Company Name (English) *</Label>
                      <Input id="companyNameEn" {...register("companyNameEn")} />
                      {errors.companyNameEn && <p className="text-xs font-semibold text-destructive">{errors.companyNameEn.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taglineEn">Company Tagline (English)</Label>
                      <Input id="taglineEn" placeholder="e.g. Engineering & Hydraulic Solutions" {...register("taglineEn")} />
                    </div>
                  </div>
                }
                arabicFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyNameAr">اسم الشركة (بالعربية) *</Label>
                      <Input id="companyNameAr" {...register("companyNameAr")} />
                      {errors.companyNameAr && <p className="text-xs font-semibold text-destructive">{errors.companyNameAr.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taglineAr">شعار الشركة (بالعربية)</Label>
                      <Input id="taglineAr" placeholder="مثال: حلول الهندسة والهيدروليك المتقدمة" {...register("taglineAr")} />
                    </div>
                  </div>
                }
                kurdishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyNameKu">ناوی کۆمپانیا (بە کوردی)</Label>
                      <Input id="companyNameKu" {...register("companyNameKu")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taglineKu">درووشمی کۆمپانیا (بە کوردی)</Label>
                      <Input id="taglineKu" placeholder="نموونە: چارەسەرە پێشکەوتووەکانی هایدرۆلیک" {...register("taglineKu")} />
                    </div>
                  </div>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Languages Settings Tab (READ-ONLY) */}
        <TabsContent value="languages" className="focus-visible:outline-none space-y-6">
          <Card>
            <CardContent className="pt-6">
              <LanguageListTable isReadOnly={true} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Company Information Tab */}
        <TabsContent value="company" className="focus-visible:outline-none space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Company Overview & Corporate Information
              </CardTitle>
              <CardDescription>
                Manage legal name, business description, commercial registration, industry, mission, and vision statements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b">
                <div className="space-y-2">
                  <Label htmlFor="foundedYear" className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" /> Founded Year
                  </Label>
                  <Input id="foundedYear" placeholder="e.g. 2008" {...register("foundedYear")} />
                </div>
              </div>

              <MultilingualTabs
                englishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="legalNameEn">Legal Registered Name (English)</Label>
                      <Input id="legalNameEn" placeholder="Legal registered company name" {...register("legalNameEn")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industryEn">Industry / Sector (English)</Label>
                      <Input id="industryEn" placeholder="e.g. Industrial Engineering & Hydraulics" {...register("industryEn")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionEn">Company Overview (English)</Label>
                      <Textarea id="descriptionEn" className="min-h-[100px]" placeholder="Brief company summary..." {...register("descriptionEn")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registrationInfoEn">Registration / Tax ID (English)</Label>
                      <Input id="registrationInfoEn" placeholder="Commercial Register # / Tax ID" {...register("registrationInfoEn")} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="missionEn" className="flex items-center gap-1">
                          <Target className="h-3.5 w-3.5 text-primary" /> Mission Statement (English)
                        </Label>
                        <Textarea id="missionEn" className="min-h-[90px]" {...register("missionEn")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="visionEn" className="flex items-center gap-1">
                          <Compass className="h-3.5 w-3.5 text-primary" /> Vision Statement (English)
                        </Label>
                        <Textarea id="visionEn" className="min-h-[90px]" {...register("visionEn")} />
                      </div>
                    </div>
                  </div>
                }
                arabicFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="legalNameAr">الاسم القانوني المسجل (بالعربية)</Label>
                      <Input id="legalNameAr" placeholder="الاسم القانوني للشركة" {...register("legalNameAr")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industryAr">القطاع / المجال (بالعربية)</Label>
                      <Input id="industryAr" placeholder="مثال: الهندسة الصناعية والأنظمة الهيدروليكية" {...register("industryAr")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionAr">نبذة عن الشركة (بالعربية)</Label>
                      <Textarea id="descriptionAr" className="min-h-[100px]" placeholder="ملخص عن الشركة..." {...register("descriptionAr")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registrationInfoAr">بيانات السجل التجاري والضريبي (بالعربية)</Label>
                      <Input id="registrationInfoAr" placeholder="رقم السجل التجاري / الرقم الضريبي" {...register("registrationInfoAr")} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="missionAr" className="flex items-center gap-1">
                          <Target className="h-3.5 w-3.5 text-primary" /> رسالة الشركة (بالعربية)
                        </Label>
                        <Textarea id="missionAr" className="min-h-[90px]" {...register("missionAr")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="visionAr" className="flex items-center gap-1">
                          <Compass className="h-3.5 w-3.5 text-primary" /> رؤية الشركة (بالعربية)
                        </Label>
                        <Textarea id="visionAr" className="min-h-[90px]" {...register("visionAr")} />
                      </div>
                    </div>
                  </div>
                }
                kurdishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="legalNameKu">ناوی یاسایی تۆمارکراو (بە کوردی)</Label>
                      <Input id="legalNameKu" placeholder="ناوی یاسایی کۆمپانیا" {...register("legalNameKu")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industryKu">بوار / پیشەسازی (بە کوردی)</Label>
                      <Input id="industryKu" placeholder="بوار" {...register("industryKu")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionKu">دەربارەی کۆمپانیا (بە کوردی)</Label>
                      <Textarea id="descriptionKu" className="min-h-[100px]" placeholder="پوختەیەک دەربارەی کۆمپانیا..." {...register("descriptionKu")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registrationInfoKu">زانیاری تۆماری بازرگانی (بە کوردی)</Label>
                      <Input id="registrationInfoKu" placeholder="ژمارەی تۆماری بازرگانی" {...register("registrationInfoKu")} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="missionKu" className="flex items-center gap-1">
                          <Target className="h-3.5 w-3.5 text-primary" /> پەیامی کۆمپانیا (بە کوردی)
                        </Label>
                        <Textarea id="missionKu" className="min-h-[90px]" {...register("missionKu")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="visionKu" className="flex items-center gap-1">
                          <Compass className="h-3.5 w-3.5 text-primary" /> ڕوئیا / ئامانجی کۆمپانیا (بە کوردی)
                        </Label>
                        <Textarea id="visionKu" className="min-h-[90px]" {...register("visionKu")} />
                      </div>
                    </div>
                  </div>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Contact Information Tab */}
        <TabsContent value="contact" className="focus-visible:outline-none space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Primary Communication Channels & Headquarters Contact
              </CardTitle>
              <CardDescription>
                Manage primary email, phone numbers, WhatsApp, headquarters address, working hours, and map coordinates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Primary Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input id="email" type="email" placeholder="info@ruknalassi.com" {...register("email")} />
                  </div>
                  {errors.email && <p className="text-xs font-semibold text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Primary Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input id="phone" placeholder="+964 7XX XXX XXXX" {...register("phone")} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneSecondary">Secondary Phone Number</Label>
                  <Input id="phoneSecondary" placeholder="+964 7XX XXX XXXX" {...register("phoneSecondary")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">WhatsApp Business Number</Label>
                  <Input id="whatsappNumber" placeholder="+964 7XX XXX XXXX" {...register("whatsappNumber")} />
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Headquarters Address & Working Hours
                </h3>

                <MultilingualTabs
                  englishFields={
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="addressEn">Headquarters Address (English)</Label>
                        <Textarea id="addressEn" className="min-h-[80px]" placeholder="Official HQ street address..." {...register("addressEn")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workingHoursEn">Working Hours (English)</Label>
                        <Input id="workingHoursEn" placeholder="e.g. Mon - Sat: 8:00 AM - 6:00 PM" {...register("workingHoursEn")} />
                      </div>
                    </div>
                  }
                  arabicFields={
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="addressAr">عنوان المقر الرئيسي (بالعربية)</Label>
                        <Textarea id="addressAr" className="min-h-[80px]" placeholder="عنوان الشارع والمقر الرئيسي..." {...register("addressAr")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workingHoursAr">أوقات العمل (بالعربية)</Label>
                        <Input id="workingHoursAr" placeholder="مثال: الإثنين - السبت: 8:00 صباحاً - 6:00 مساءً" {...register("workingHoursAr")} />
                      </div>
                    </div>
                  }
                  kurdishFields={
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="addressKu">ناونیشانی بنکەی سەرەکی (بە کوردی)</Label>
                        <Textarea id="addressKu" className="min-h-[80px]" placeholder="ناونیشانی سەرەکی..." {...register("addressKu")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workingHoursKu">کاتەکانی کارکردن (بە کوردی)</Label>
                        <Input id="workingHoursKu" placeholder="نموونە: دووشەممە - شەممە: ٨:٠٠ی بەیانی - ٦:٠٠ی ئێوارە" {...register("workingHoursKu")} />
                      </div>
                    </div>
                  }
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" /> Map Location & Geo-Coordinates
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="googleMapsUrl">Google Maps Link</Label>
                  <Input id="googleMapsUrl" placeholder="https://maps.google.com/..." {...register("googleMapsUrl")} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" type="number" step="any" {...register("latitude", { valueAsNumber: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" type="number" step="any" {...register("longitude", { valueAsNumber: true })} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. Social Media Tab */}
        <TabsContent value="social" className="focus-visible:outline-none space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                Official Social Media Profiles
              </CardTitle>
              <CardDescription>
                Configure official social media links displayed in the website header and footer.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebookUrl">Facebook Page URL</Label>
                <Input id="facebookUrl" placeholder="https://facebook.com/..." {...register("facebookUrl")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
                <Input id="linkedinUrl" placeholder="https://linkedin.com/company/..." {...register("linkedinUrl")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram Handle URL</Label>
                <Input id="instagramUrl" placeholder="https://instagram.com/..." {...register("instagramUrl")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube Channel URL</Label>
                <Input id="youtubeUrl" placeholder="https://youtube.com/..." {...register("youtubeUrl")} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="twitterUrl">X / Twitter URL</Label>
                <Input id="twitterUrl" placeholder="https://x.com/..." {...register("twitterUrl")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. Branding Tab */}
        <TabsContent value="branding" className="focus-visible:outline-none space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Website Branding Assets & Open Graph Media
              </CardTitle>
              <CardDescription>
                Upload high-resolution primary logo, dark mode logo, website favicon, and social media share image using Supabase Storage.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Logo */}
              <div className="space-y-2 border p-4 rounded-xl bg-card">
                <Label className="font-semibold text-sm">Primary Logo (Light Background)</Label>
                <p className="text-xs text-muted-foreground pb-2">Main header and document logo.</p>
                <ImageUploader
                  value={watch("logoUrl") ?? null}
                  onChange={(url) => setValue("logoUrl", url)}
                  bucket="branding"
                  folder="logos"
                  label="Upload Main Logo"
                />
              </div>

              {/* Dark Mode Logo */}
              <div className="space-y-2 border p-4 rounded-xl bg-card">
                <Label className="font-semibold text-sm">Secondary Logo (Dark Background)</Label>
                <p className="text-xs text-muted-foreground pb-2">Dark mode navigation and footer logo.</p>
                <ImageUploader
                  value={watch("logoDarkUrl") ?? null}
                  onChange={(url) => setValue("logoDarkUrl", url)}
                  bucket="branding"
                  folder="logos"
                  label="Upload Dark Logo"
                />
              </div>

              {/* Favicon */}
              <div className="space-y-2 border p-4 rounded-xl bg-card">
                <Label className="font-semibold text-sm">Favicon Icon (32x32 / ICO / PNG)</Label>
                <p className="text-xs text-muted-foreground pb-2">Browser tab icon.</p>
                <ImageUploader
                  value={watch("faviconUrl") ?? null}
                  onChange={(url) => setValue("faviconUrl", url)}
                  bucket="branding"
                  folder="favicons"
                  label="Upload Favicon"
                />
              </div>

              {/* Open Graph Image */}
              <div className="space-y-2 border p-4 rounded-xl bg-card">
                <Label className="font-semibold text-sm">Open Graph / Social Preview Image</Label>
                <p className="text-xs text-muted-foreground pb-2">Default image when sharing website links on social media.</p>
                <ImageUploader
                  value={watch("ogImageUrl") ?? null}
                  onChange={(url) => setValue("ogImageUrl", url)}
                  bucket="branding"
                  folder="og-images"
                  label="Upload OG Share Image"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}
