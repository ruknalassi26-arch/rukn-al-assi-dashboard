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
  logoUrl: z.string().optional().nullable(),
  logoDarkUrl: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")).nullable(),
  phone: z.string().optional().nullable(),
  phoneSecondary: z.string().optional().nullable(),
  addressEn: z.string().optional().nullable(),
  addressAr: z.string().optional().nullable(),
  addressKu: z.string().optional().nullable(),
  googleMapsUrl: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  workingHoursEn: z.string().optional().nullable(),
  workingHoursAr: z.string().optional().nullable(),
  workingHoursKu: z.string().optional().nullable(),
  facebookUrl: z.string().optional().nullable(),
  twitterUrl: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  youtubeUrl: z.string().optional().nullable(),
  whatsappNumber: z.string().optional().nullable(),
  seoTitleEn: z.string().optional().nullable(),
  seoTitleAr: z.string().optional().nullable(),
  seoTitleKu: z.string().optional().nullable(),
  seoDescriptionEn: z.string().optional().nullable(),
  seoDescriptionAr: z.string().optional().nullable(),
  seoDescriptionKu: z.string().optional().nullable(),
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
      logoUrl: settings?.logoUrl ?? "",
      logoDarkUrl: settings?.logoDarkUrl ?? "",
      faviconUrl: settings?.faviconUrl ?? "",
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
      seoTitleEn: settings?.seoTitleEn ?? "Rukn Al Assi | Hydraulic & Industrial Supplies",
      seoTitleAr: settings?.seoTitleAr ?? "ركن العاصي | المنتجات والحلول الهيدروليكية والصناعية",
      seoTitleKu: settings?.seoTitleKu ?? "",
      seoDescriptionEn: settings?.seoDescriptionEn ?? "Official admin settings for Rukn Al Assi engineering and hydraulic systems.",
      seoDescriptionAr: settings?.seoDescriptionAr ?? "الإعدادات العامة والمترجمة لشركة ركن العاصي للأنظمة الهيدروليكية والصناعية.",
      seoDescriptionKu: settings?.seoDescriptionKu ?? "",
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
            Configure global website settings, multilingual information, contact channels, social profiles, and branding assets.
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
                General Settings & Taglines
              </CardTitle>
              <CardDescription>
                Set the official company name and taglines across English, Arabic, and Kurdish Sorani.
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

        {/* 2. Languages Settings Tab */}
        <TabsContent value="languages" className="focus-visible:outline-none space-y-6">
          <Card>
            <CardContent className="pt-6">
              <LanguageListTable />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Company Information Tab */}
        <TabsContent value="company" className="focus-visible:outline-none space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Company Address & Working Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MultilingualTabs
                englishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="addressEn">Headquarters Address (English)</Label>
                      <Textarea id="addressEn" className="min-h-[90px]" {...register("addressEn")} />
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
                      <Textarea id="addressAr" className="min-h-[90px]" {...register("addressAr")} />
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
                      <Textarea id="addressKu" className="min-h-[90px]" {...register("addressKu")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workingHoursKu">کاتەکانی کارکردن (بە کوردی)</Label>
                      <Input id="workingHoursKu" placeholder="نموونە: دووشەممە - شەممە: ٨:٠٠ی بەیانی - ٦:٠٠ی ئێوارە" {...register("workingHoursKu")} />
                    </div>
                  </div>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Contact Information Tab */}
        <TabsContent value="contact" className="focus-visible:outline-none space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Primary Communication Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Primary Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="info@ruknalassi.com" {...register("email")} />
                  </div>
                  {errors.email && <p className="text-xs font-semibold text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Primary Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
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

              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="googleMapsUrl">Google Maps Link</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Input id="googleMapsUrl" placeholder="https://maps.google.com/..." {...register("googleMapsUrl")} />
                </div>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Social Media Tab */}
        <TabsContent value="social" className="focus-visible:outline-none space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                Social Media Profiles
              </CardTitle>
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
              <div className="space-y-2">
                <Label htmlFor="twitterUrl">X / Twitter URL</Label>
                <Input id="twitterUrl" placeholder="https://x.com/..." {...register("twitterUrl")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. Branding Tab */}
        <TabsContent value="branding" className="focus-visible:outline-none space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Logo & Favicon Branding Assets
              </CardTitle>
              <CardDescription>
                Upload high-resolution primary logo, dark mode logo, and website favicon using Supabase Storage (branding bucket).
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Primary Logo */}
              <div className="space-y-2">
                <Label className="font-semibold">Primary Logo (Light Background)</Label>
                <ImageUploader
                  value={watch("logoUrl") ?? null}
                  onChange={(url) => setValue("logoUrl", url)}
                  bucket="branding"
                  folder="logos"
                  label="Upload Main Logo"
                />
              </div>

              {/* Dark Mode Logo */}
              <div className="space-y-2">
                <Label className="font-semibold">Secondary Logo (Dark Background)</Label>
                <ImageUploader
                  value={watch("logoDarkUrl") ?? null}
                  onChange={(url) => setValue("logoDarkUrl", url)}
                  bucket="branding"
                  folder="logos"
                  label="Upload Dark Logo"
                />
              </div>

              {/* Favicon */}
              <div className="space-y-2">
                <Label className="font-semibold">Favicon Icon (32x32 / ICO / PNG)</Label>
                <ImageUploader
                  value={watch("faviconUrl") ?? null}
                  onChange={(url) => setValue("faviconUrl", url)}
                  bucket="branding"
                  folder="favicons"
                  label="Upload Favicon"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}
