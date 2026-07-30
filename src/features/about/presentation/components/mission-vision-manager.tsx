"use client";
// ==============================================================================
// features/about/presentation/components/mission-vision-manager.tsx
// Management form for Company Mission and Vision with Bilingual Tabs
// ==============================================================================
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { BilingualTabs } from "@shared/components/bilingual-tabs";
import { useMission, useUpdateMission, useVision, useUpdateVision } from "@shared/hooks/about/use-about-hooks";
import { ErrorState } from "@shared/components/error-state";

const sectionSchema = z.object({
  titleEn: z.string().min(2, "English title is required"),
  titleAr: z.string().min(2, "Arabic title is required"),
  contentEn: z.string().optional().nullable(),
  contentAr: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  status: z.enum(["active", "draft"]),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

export function MissionVisionManager() {
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
      contentEn: "",
      contentAr: "",
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
      contentEn: "",
      contentAr: "",
      icon: "Eye",
      status: "active",
    },
  });

  useEffect(() => {
    if (mission) {
      missionForm.reset({
        titleEn: mission.titleEn,
        titleAr: mission.titleAr,
        contentEn: mission.contentEn ?? "",
        contentAr: mission.contentAr ?? "",
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
        contentEn: vision.contentEn ?? "",
        contentAr: vision.contentAr ?? "",
        icon: vision.icon ?? "Eye",
        status: vision.status,
      });
    }
  }, [vision, visionForm]);

  const onSaveMission = async (values: SectionFormValues) => {
    await updateMissionMutation.mutateAsync(values);
  };

  const onSaveVision = async (values: SectionFormValues) => {
    await updateVisionMutation.mutateAsync(values);
  };

  if (isMissionLoading || isVisionLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><Skeleton className="h-6 w-36" /></CardHeader>
          <CardContent className="space-y-4"><Skeleton className="h-32 w-full" /></CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-6 w-36" /></CardHeader>
          <CardContent className="space-y-4"><Skeleton className="h-32 w-full" /></CardContent>
        </Card>
      </div>
    );
  }

  if (missionError || visionError) {
    return (
      <ErrorState
        title="Failed to load mission/vision data"
        error={missionError ?? visionError}
        onRetry={() => {
          refetchMission();
          refetchVision();
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* MISSION CARD */}
      <form onSubmit={missionForm.handleSubmit(onSaveMission)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600" />
              <div>
                <CardTitle>Company Mission</CardTitle>
                <CardDescription>Core objective and purpose of the organization.</CardDescription>
              </div>
            </div>
            <Button type="submit" disabled={updateMissionMutation.isPending} size="sm" className="gap-2">
              {updateMissionMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Mission
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <BilingualTabs
              englishFields={
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Title (English)</Label>
                    <Input {...missionForm.register("titleEn")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Content (English)</Label>
                    <Textarea rows={4} {...missionForm.register("contentEn")} />
                  </div>
                </div>
              }
              arabicFields={
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>العنوان (بالعربية)</Label>
                    <Input dir="rtl" {...missionForm.register("titleAr")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>المحتوى (بالعربية)</Label>
                    <Textarea rows={4} dir="rtl" {...missionForm.register("contentAr")} />
                  </div>
                </div>
              }
            />

            <div className="space-y-1.5 pt-2 border-t">
              <Label>Status</Label>
              <Select
                value={missionForm.watch("status")}
                onValueChange={(val: "active" | "draft") => missionForm.setValue("status", val)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* VISION CARD */}
      <form onSubmit={visionForm.handleSubmit(onSaveVision)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <div>
                <CardTitle>Company Vision</CardTitle>
                <CardDescription>Long-term aspirations and strategic direction.</CardDescription>
              </div>
            </div>
            <Button type="submit" disabled={updateVisionMutation.isPending} size="sm" className="gap-2">
              {updateVisionMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Vision
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <BilingualTabs
              englishFields={
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Title (English)</Label>
                    <Input {...visionForm.register("titleEn")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Content (English)</Label>
                    <Textarea rows={4} {...visionForm.register("contentEn")} />
                  </div>
                </div>
              }
              arabicFields={
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>العنوان (بالعربية)</Label>
                    <Input dir="rtl" {...visionForm.register("titleAr")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>المحتوى (بالعربية)</Label>
                    <Textarea rows={4} dir="rtl" {...visionForm.register("contentAr")} />
                  </div>
                </div>
              }
            />

            <div className="space-y-1.5 pt-2 border-t">
              <Label>Status</Label>
              <Select
                value={visionForm.watch("status")}
                onValueChange={(val: "active" | "draft") => visionForm.setValue("status", val)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
