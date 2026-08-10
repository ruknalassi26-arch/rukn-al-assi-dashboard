"use client";
// ==============================================================================
// features/about/presentation/components/company-info-manager.tsx
// Management form for Company Information (History, Mission, Vision)
// Strictly matching company_profile & company_profile_translations DB schema
// With Single "Save Information" button for ALL languages simultaneously
// ==============================================================================
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Save, History as HistoryIcon, Target, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Label,
  Textarea,
  Tabs,
  TabsList,
  TabsTrigger,
  Skeleton,
} from "@shared/ui";
import { useCompanyInfo, useUpdateCompanyInfoTranslation } from "@shared/hooks/about/use-about-hooks";
import { usePermission } from "@features/roles-permissions/presentation/hooks/use-permission";
import { ErrorState } from "@shared/components/error-state";
import { toast } from "@core/utils/toast";

export function CompanyInfoManager() {
  const t = useTranslations("aboutAdmin.overview");
  const tCommon = useTranslations("common");

  const { hasPermission } = usePermission();
  const canManage = hasPermission("about", "manage");

  const [activeLang, setActiveLang] = useState<"en" | "ar" | "ckb">("en");

  const { data: companyData, isLoading: isDataLoading, error, refetch } = useCompanyInfo();
  const updateMutation = useUpdateCompanyInfoTranslation();

  // State for all 3 languages
  const [historyEn, setHistoryEn] = useState("");
  const [missionEn, setMissionEn] = useState("");
  const [visionEn, setVisionEn] = useState("");

  const [historyAr, setHistoryAr] = useState("");
  const [missionAr, setMissionAr] = useState("");
  const [visionAr, setVisionAr] = useState("");

  const [historyKu, setHistoryKu] = useState("");
  const [missionKu, setMissionKu] = useState("");
  const [visionKu, setVisionKu] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (companyData) {
      const en = companyData.getTranslation("en");
      setHistoryEn(en.history || "");
      setMissionEn(en.mission || "");
      setVisionEn(en.vision || "");

      const ar = companyData.getTranslation("ar");
      setHistoryAr(ar.history || "");
      setMissionAr(ar.mission || "");
      setVisionAr(ar.vision || "");

      const ku = companyData.getTranslation("ckb");
      setHistoryKu(ku.history || "");
      setMissionKu(ku.mission || "");
      setVisionKu(ku.vision || "");
    }
  }, [companyData]);

  // Saves ALL languages in one operation
  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canManage) return;

    setIsSaving(true);
    try {
      // Save English
      await updateMutation.mutateAsync({
        language_code: "en",
        history: historyEn,
        mission: missionEn,
        vision: visionEn,
      });

      // Save Arabic
      await updateMutation.mutateAsync({
        language_code: "ar",
        history: historyAr,
        mission: missionAr,
        vision: visionAr,
      });

      // Save Kurdish
      await updateMutation.mutateAsync({
        language_code: "ckb",
        history: historyKu,
        mission: missionKu,
        vision: visionKu,
      });
    } catch {
      // Handled by mutation onError
    } finally {
      setIsSaving(false);
    }
  };

  if (isDataLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <ErrorState error={error as Error} onRetry={() => refetch()} />;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-muted/20 pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              Company Profile & Narrative
            </CardTitle>
            <CardDescription className="text-xs">
              Manage Company History, Mission, and Vision across all system languages.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Language Tabs */}
            <Tabs value={activeLang} onValueChange={(val) => setActiveLang(val as "en" | "ar" | "ckb")}>
              <TabsList className="grid grid-cols-3 w-[260px] h-9 p-1 bg-muted/60 border rounded-lg shadow-xs">
                <TabsTrigger value="en" className="gap-1.5 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-xs">
                  <span className="text-sm leading-none">🇺🇸</span> English
                </TabsTrigger>
                <TabsTrigger value="ar" className="gap-1.5 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-xs">
                  <span className="text-sm leading-none">🇮🇶</span> العربية
                </TabsTrigger>
                <TabsTrigger value="ckb" className="gap-1.5 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-xs">
                  <span className="text-sm leading-none">☀️</span> کوردی
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* SINGLE SAVE BUTTON FOR ALL LANGUAGES */}
            {canManage && (
              <Button
                type="button"
                onClick={() => handleSaveAll()}
                disabled={isSaving || updateMutation.isPending}
                className="gap-2 shrink-0 h-9"
              >
                {isSaving || updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Information
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSaveAll} className="space-y-6">
          {/* ENGLISH FORM */}
          {activeLang === "en" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <HistoryIcon className="h-4 w-4 text-blue-600" />
                  Company History (English)
                </Label>
                <Textarea
                  value={historyEn}
                  onChange={(e) => setHistoryEn(e.target.value)}
                  placeholder="Enter comprehensive company background, founding story, and milestone journey in English..."
                  rows={5}
                  disabled={!canManage}
                  className="resize-y"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-600" />
                  Company Mission (English)
                </Label>
                <Textarea
                  value={missionEn}
                  onChange={(e) => setMissionEn(e.target.value)}
                  placeholder="Enter the core company mission statement in English..."
                  rows={4}
                  disabled={!canManage}
                  className="resize-y"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Eye className="h-4 w-4 text-violet-600" />
                  Company Vision (English)
                </Label>
                <Textarea
                  value={visionEn}
                  onChange={(e) => setVisionEn(e.target.value)}
                  placeholder="Enter long-term strategic vision statement in English..."
                  rows={4}
                  disabled={!canManage}
                  className="resize-y"
                />
              </div>
            </div>
          )}

          {/* ARABIC FORM */}
          {activeLang === "ar" && (
            <div className="space-y-6" dir="rtl">
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <HistoryIcon className="h-4 w-4 text-blue-600" />
                  تاريخ الشركة (العربية)
                </Label>
                <Textarea
                  value={historyAr}
                  onChange={(e) => setHistoryAr(e.target.value)}
                  placeholder="أدخل خلفية الشركة وقصة التأسيس باللغة العربية..."
                  rows={5}
                  disabled={!canManage}
                  className="resize-y"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-600" />
                  رسالة الشركة (العربية)
                </Label>
                <Textarea
                  value={missionAr}
                  onChange={(e) => setMissionAr(e.target.value)}
                  placeholder="أدخل بيان رسالة الشركة باللغة العربية..."
                  rows={4}
                  disabled={!canManage}
                  className="resize-y"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Eye className="h-4 w-4 text-violet-600" />
                  رؤية الشركة (العربية)
                </Label>
                <Textarea
                  value={visionAr}
                  onChange={(e) => setVisionAr(e.target.value)}
                  placeholder="أدخل الرؤية الاستراتيجية باللغة العربية..."
                  rows={4}
                  disabled={!canManage}
                  className="resize-y"
                />
              </div>
            </div>
          )}

          {/* KURDISH FORM */}
          {activeLang === "ckb" && (
            <div className="space-y-6" dir="rtl">
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <HistoryIcon className="h-4 w-4 text-blue-600" />
                  مێژووی کۆمپانیا (کوردی)
                </Label>
                <Textarea
                  value={historyKu}
                  onChange={(e) => setHistoryKu(e.target.value)}
                  placeholder="مێژووی کۆمپانیا و چیرۆکی دامەزراندن بە زمانی کوردی بنووسە..."
                  rows={5}
                  disabled={!canManage}
                  className="resize-y"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-600" />
                  ئامانجی کۆمپانیا (کوردی)
                </Label>
                <Textarea
                  value={missionKu}
                  onChange={(e) => setMissionKu(e.target.value)}
                  placeholder="پەیامی سەرەکی کۆمپانیا بە زمانی کوردی بنووسە..."
                  rows={4}
                  disabled={!canManage}
                  className="resize-y"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Eye className="h-4 w-4 text-violet-600" />
                  دیدگای کۆمپانیا (کوردی)
                </Label>
                <Textarea
                  value={visionKu}
                  onChange={(e) => setVisionKu(e.target.value)}
                  placeholder="دیدگای درێژخایەنی کۆمپانیا بە زمانی کوردی بنووسە..."
                  rows={4}
                  disabled={!canManage}
                  className="resize-y"
                />
              </div>
            </div>
          )}

        </form>
      </CardContent>
    </Card>
  );
}
