"use client";
// ==============================================================================
// features/about/presentation/components/mission-vision-manager.tsx
// Management form for Company Mission and Vision with Bilingual Tabs
// ==============================================================================
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Loader2, Save, Target, Eye } from "lucide-react";
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
  Skeleton,
} from "@shared/ui";
import { MultilingualTabs } from "@shared/components/multilingual-tabs";
import { useMission, useUpdateMission, useVision, useUpdateVision } from "@shared/hooks/about/use-about-hooks";
import { ErrorState } from "@shared/components/error-state";

const sectionSchema = z.object({
  titleEn: z.string().min(2, "English title is required"),
  titleAr: z.string().min(2, "Arabic title is required"),
  titleKu: z.string().optional().nullable(),
  contentEn: z.string().optional().nullable(),
  contentAr: z.string().optional().nullable(),
  contentKu: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  status: z.enum(["active", "draft"]),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

export function MissionVisionManager() {
  const tMission = useTranslations("aboutAdmin.mission");
  const tVision = useTranslations("aboutAdmin.vision");
  const tCommon = useTranslations("common");

  const { data: mission, isLoading: isMissionLoading, error: missionError, refetch: refetchMission } = useMission();
  const { data: vision, isLoading: isVisionLoading, error: visionError, refetch: refetchVision } = useVision();

  const updateMissionMutation = useUpdateMission();
  const updateVisionMutation = useUpdateVision();

  // Mission Form
  const missionForm = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      titleEn: "Our Mission",
      titleAr: "مهمتنا",
      titleKu: "",
      contentEn: "",
      contentAr: "",
      contentKu: "",
      icon: "Target",
      status: "active",
    },
  });

  // Vision Form
  const visionForm = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      titleEn: "Our Vision",
      titleAr: "رؤيتنا",
      titleKu: "",
      contentEn: "",
      contentAr: "",
      contentKu: "",
      icon: "Eye",
      status: "active",
    },
  });

  useEffect(() => {
    if (mission) {
      missionForm.reset({
        titleEn: mission.titleEn,
        titleAr: mission.titleAr,
        titleKu: (mission as any).titleKu ?? "",
        contentEn: mission.contentEn ?? "",
        contentAr: mission.contentAr ?? "",
        contentKu: (mission as any).contentKu ?? "",
        icon: mission.icon ?? "Target",
        status: mission.status,
      });
    }
  }, [mission, missionForm]);

  useEffect(() => {
    if (vision) {
      visionForm.reset({
        titleEn: vision.titleEn,
        titleAr: vision.titleAr,
        titleKu: (vision as any).titleKu ?? "",
        contentEn: vision.contentEn ?? "",
        contentAr: vision.contentAr ?? "",
        contentKu: (vision as any).contentKu ?? "",
        icon: vision.icon ?? "Eye",
        status: vision.status,
      });
    }
  }, [vision, visionForm]);

  const onMissionSubmit = async (values: SectionFormValues) => {
    await updateMissionMutation.mutateAsync(values as any);
  };

  const onVisionSubmit = async (values: SectionFormValues) => {
    await updateVisionMutation.mutateAsync(values as any);
  };

  if (isMissionLoading || isVisionLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (missionError || visionError) {
    return (
      <ErrorState
        title={tCommon("error")}
        error={missionError ?? visionError ?? new Error("Failed to load")}
        onRetry={() => {
          refetchMission();
          refetchVision();
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Company Mission Form */}
      <form onSubmit={missionForm.handleSubmit(onMissionSubmit)}>
        <Card className="h-full flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-500" />
                <CardTitle>{tMission("title")}</CardTitle>
              </div>
              <CardDescription>{tMission("subtitle")}</CardDescription>
            </div>
            <Button type="submit" disabled={updateMissionMutation.isPending} size="sm" className="gap-2">
              {updateMissionMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {tMission("saveBtn")}
            </Button>
          </CardHeader>

          <CardContent className="space-y-4 flex-1">
            <MultilingualTabs
              englishFields={
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="mTitleEn">{tMission("titleEn")}</Label>
                    <Input id="mTitleEn" {...missionForm.register("titleEn")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="mContentEn">{tMission("contentEn")}</Label>
                    <Textarea id="mContentEn" rows={4} {...missionForm.register("contentEn")} />
                  </div>
                </div>
              }
              arabicFields={
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="mTitleAr">{tMission("titleAr")}</Label>
                    <Input id="mTitleAr" dir="rtl" {...missionForm.register("titleAr")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="mContentAr">{tMission("contentAr")}</Label>
                    <Textarea id="mContentAr" dir="rtl" rows={4} {...missionForm.register("contentAr")} />
                  </div>
                </div>
              }
              kurdishFields={
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="mTitleKu">{tMission("titleKu")}</Label>
                    <Input id="mTitleKu" dir="rtl" {...missionForm.register("titleKu")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="mContentKu">{tMission("contentKu")}</Label>
                    <Textarea id="mContentKu" dir="rtl" rows={4} {...missionForm.register("contentKu")} />
                  </div>
                </div>
              }
            />

            <div className="space-y-1.5 pt-2">
              <Label htmlFor="mStatus">{tCommon("status")}</Label>
              <Select
                value={missionForm.watch("status")}
                onValueChange={(val) => missionForm.setValue("status", val as "active" | "draft")}
              >
                <SelectTrigger id="mStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{tCommon("active")}</SelectItem>
                  <SelectItem value="draft">{tCommon("draft")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Company Vision Form */}
      <form onSubmit={visionForm.handleSubmit(onVisionSubmit)}>
        <Card className="h-full flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-500" />
                <CardTitle>{tVision("title")}</CardTitle>
              </div>
              <CardDescription>{tVision("subtitle")}</CardDescription>
            </div>
            <Button type="submit" disabled={updateVisionMutation.isPending} size="sm" className="gap-2">
              {updateVisionMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {tVision("saveBtn")}
            </Button>
          </CardHeader>

          <CardContent className="space-y-4 flex-1">
            <MultilingualTabs
              englishFields={
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="vTitleEn">{tVision("titleEn")}</Label>
                    <Input id="vTitleEn" {...visionForm.register("titleEn")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="vContentEn">{tVision("contentEn")}</Label>
                    <Textarea id="vContentEn" rows={4} {...visionForm.register("contentEn")} />
                  </div>
                </div>
              }
              arabicFields={
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="vTitleAr">{tVision("titleAr")}</Label>
                    <Input id="vTitleAr" dir="rtl" {...visionForm.register("titleAr")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="vContentAr">{tVision("contentAr")}</Label>
                    <Textarea id="vContentAr" dir="rtl" rows={4} {...visionForm.register("contentAr")} />
                  </div>
                </div>
              }
              kurdishFields={
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="vTitleKu">{tVision("titleKu")}</Label>
                    <Input id="vTitleKu" dir="rtl" {...visionForm.register("titleKu")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="vContentKu">{tVision("contentKu")}</Label>
                    <Textarea id="vContentKu" dir="rtl" rows={4} {...visionForm.register("contentKu")} />
                  </div>
                </div>
              }
            />

            <div className="space-y-1.5 pt-2">
              <Label htmlFor="vStatus">{tCommon("status")}</Label>
              <Select
                value={visionForm.watch("status")}
                onValueChange={(val) => visionForm.setValue("status", val as "active" | "draft")}
              >
                <SelectTrigger id="vStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{tCommon("active")}</SelectItem>
                  <SelectItem value="draft">{tCommon("draft")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
