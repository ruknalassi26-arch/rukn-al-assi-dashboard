"use client";
// ==============================================================================
// features/contact/presentation/components/contact-info-form.tsx
// Main Contact Information & Settings Form (RHF + Zod + MultilingualTabs)
// ==============================================================================
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, MapPin, Phone, Mail, Clock, Share2, Search } from "lucide-react";
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
  Skeleton,
} from "@shared/ui";
import { MultilingualTabs } from "@shared/components/multilingual-tabs";
import { useContactInfo, useUpdateContactInfo } from "@shared/hooks/contact/use-contact-hooks";
import { ErrorState } from "@shared/components/error-state";

const contactInfoSchema = z.object({
  companyNameEn: z.string().min(2, "Company English name is required"),
  companyNameAr: z.string().min(2, "Company Arabic name is required"),
  companyNameKu: z.string().optional().nullable(),
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

export type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;

export function ContactInfoForm() {
  const { data: contactInfo, isLoading, error, refetch } = useContactInfo();
  const updateContactMutation = useUpdateContactInfo();

  const form = useForm<ContactInfoFormValues>({
    resolver: zodResolver(contactInfoSchema),
    values: {
      companyNameEn: contactInfo?.companyNameEn ?? "Rukn Al Assi Co.",
      companyNameAr: contactInfo?.companyNameAr ?? "شركة ركن العاصي",
      companyNameKu: contactInfo?.companyNameKu ?? "",
      email: contactInfo?.email ?? "",
      phone: contactInfo?.phone ?? "",
      phoneSecondary: contactInfo?.phoneSecondary ?? "",
      addressEn: contactInfo?.addressEn ?? "",
      addressAr: contactInfo?.addressAr ?? "",
      addressKu: contactInfo?.addressKu ?? "",
      googleMapsUrl: contactInfo?.googleMapsUrl ?? "",
      latitude: contactInfo?.latitude ?? 0,
      longitude: contactInfo?.longitude ?? 0,
      workingHoursEn: contactInfo?.workingHoursEn ?? "Mon - Sat: 8:00 AM - 6:00 PM",
      workingHoursAr: contactInfo?.workingHoursAr ?? "الإثنين - السبت: 8:00 صباحاً - 6:00 مساءً",
      workingHoursKu: contactInfo?.workingHoursKu ?? "",
      facebookUrl: contactInfo?.facebookUrl ?? "",
      twitterUrl: contactInfo?.twitterUrl ?? "",
      linkedinUrl: contactInfo?.linkedinUrl ?? "",
      instagramUrl: contactInfo?.instagramUrl ?? "",
      youtubeUrl: contactInfo?.youtubeUrl ?? "",
      whatsappNumber: contactInfo?.whatsappNumber ?? "",
      seoTitleEn: contactInfo?.seoTitleEn ?? "Contact Us | Rukn Al Assi",
      seoTitleAr: contactInfo?.seoTitleAr ?? "تواصل معنا | ركن العاصي",
      seoTitleKu: contactInfo?.seoTitleKu ?? "",
      seoDescriptionEn: contactInfo?.seoDescriptionEn ?? "Get in touch with Rukn Al Assi for hydraulic products, maintenance, and technical inquiries.",
      seoDescriptionAr: contactInfo?.seoDescriptionAr ?? "تواصل مع شركة ركن العاصي للمنتجات والخدمات الهيدروليكية وعروض الأسعار.",
      seoDescriptionKu: contactInfo?.seoDescriptionKu ?? "",
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (values: ContactInfoFormValues) => {
    await updateContactMutation.mutateAsync(values);
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
        title="Failed to load contact information"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Main Contact Information</h1>
          <p className="text-sm text-muted-foreground">
            Manage main headquarters contact details, phone numbers, addresses, working hours, and social channels.
          </p>
        </div>

        <Button type="submit" disabled={updateContactMutation.isPending} className="gap-2 min-w-[140px]">
          {updateContactMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Multilingual Text Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Multilingual Address & Company Info
              </CardTitle>
              <CardDescription>
                Provide company names, office addresses, and working hours in English, Arabic, and Kurdish Sorani.
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
                      <Label htmlFor="addressEn">Headquarters Address (English)</Label>
                      <Textarea id="addressEn" className="min-h-[80px]" {...register("addressEn")} />
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
                      <Label htmlFor="companyNameAr">اسم الشركة (بالعربية) *</Label>
                      <Input id="companyNameAr" {...register("companyNameAr")} />
                      {errors.companyNameAr && <p className="text-xs font-semibold text-destructive">{errors.companyNameAr.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressAr">عنوان المقر الرئيسي (بالعربية)</Label>
                      <Textarea id="addressAr" className="min-h-[80px]" {...register("addressAr")} />
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
                      <Label htmlFor="companyNameKu">ناوی کۆمپانیا (بە کوردی)</Label>
                      <Input id="companyNameKu" {...register("companyNameKu")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressKu">ناونیشانی بنکەی سەرەکی (بە کوردی)</Label>
                      <Textarea id="addressKu" className="min-h-[80px]" {...register("addressKu")} />
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

          {/* Social Links & Location Maps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                Social Links & Google Maps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleMapsUrl">Google Maps URL / Embed Link</Label>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                  <Input id="whatsappNumber" placeholder="+964 7XX XXX XXXX" {...register("whatsappNumber")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebookUrl">Facebook Page URL</Label>
                  <Input id="facebookUrl" placeholder="https://facebook.com/..." {...register("facebookUrl")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
                  <Input id="linkedinUrl" placeholder="https://linkedin.com/in/..." {...register("linkedinUrl")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagramUrl">Instagram Profile URL</Label>
                  <Input id="instagramUrl" placeholder="https://instagram.com/..." {...register("instagramUrl")} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Contact Page SEO */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Contact Page SEO (Basic)
              </CardTitle>
              <CardDescription>Configure meta title and meta description for the Contact Us page.</CardDescription>
            </CardHeader>
            <CardContent>
              <MultilingualTabs
                englishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="seoTitleEn">SEO Meta Title (English)</Label>
                      <Input id="seoTitleEn" {...register("seoTitleEn")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seoDescriptionEn">SEO Meta Description (English)</Label>
                      <Textarea id="seoDescriptionEn" className="min-h-[80px]" {...register("seoDescriptionEn")} />
                    </div>
                  </div>
                }
                arabicFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="seoTitleAr">عنوان SEO (بالعربية)</Label>
                      <Input id="seoTitleAr" {...register("seoTitleAr")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seoDescriptionAr">وصف SEO (بالعربية)</Label>
                      <Textarea id="seoDescriptionAr" className="min-h-[80px]" {...register("seoDescriptionAr")} />
                    </div>
                  </div>
                }
                kurdishFields={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="seoTitleKu">نیشانی SEO (بە کوردی)</Label>
                      <Input id="seoTitleKu" {...register("seoTitleKu")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seoDescriptionKu">وەسفی SEO (بە کوردی)</Label>
                      <Textarea id="seoDescriptionKu" className="min-h-[80px]" {...register("seoDescriptionKu")} />
                    </div>
                  </div>
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Direct Contacts */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Direct Communication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="phoneSecondary">Secondary Phone / Landline</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Input id="phoneSecondary" placeholder="+964 7XX XXX XXXX" {...register("phoneSecondary")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
