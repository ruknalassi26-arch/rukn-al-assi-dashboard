"use client";
// ==============================================================================
// features/about/presentation/components/company-info-manager.tsx
// Management form for Company Information (History, Mission, Vision)
// Strictly matching company_profile & company_profile_translations DB schema
// Uses exact language codes from public.languages table to prevent FK errors
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
import { useCompanyInfo, useUpdateCompanyInfoTranslationsBatch } from "@shared/hooks/about/use-about-hooks";
import { useLanguages } from "@shared/hooks/settings/use-language-hooks";
import { usePermission } from "@features/roles-permissions/presentation/hooks/use-permission";
import { ErrorState } from "@shared/components/error-state";

export function CompanyInfoManager() {
  const t = useTranslations("aboutAdmin.overview");
  const tCommon = useTranslations("common");

  const { hasPermission } = usePermission();
  const canManage = hasPermission("about", "manage");

  const { data: languagesData, isLoading: isLangsLoading } = useLanguages();

  // Dynamically resolve active languages from DB
  const activeLanguages = (languagesData && languagesData.length > 0)
    ? languagesData.map((l) => ({
        code: l.code,
        name: l.name || l.code.toUpperCase(),
        flag: l.code.startsWith("ar") ? "🇮🇶" : l.code.startsWith("ku") || l.code === "ckb" ? "☀️" : "🇺🇸",
        dir: l.isRtl ? "rtl" : "ltr",
      }))
    : [
        { code: "en", name: "English", flag: "🇺🇸", dir: "ltr" },
        { code: "ar", name: "العربية", flag: "🇮🇶", dir: "rtl" },
        { code: "ku", name: "کوردی", flag: "☀️", dir: "rtl" },
      ];

  const [activeLang, setActiveLang] = useState<string>("en");

  // Keep activeLang in sync with available language codes
  useEffect(() => {
    if (activeLanguages.length > 0 && !activeLanguages.some((l) => l.code === activeLang)) {
      setActiveLang(activeLanguages[0].code);
    }
  }, [activeLanguages, activeLang]);

  const { data: companyData, isLoading: isDataLoading, error, refetch } = useCompanyInfo();
  const updateBatchMutation = useUpdateCompanyInfoTranslationsBatch();

  // Dictionary state for all translations by language code
  const [translationsState, setTranslationsState] = useState<
    Record<string, { history: string; mission: string; vision: string }>
  >({});

  useEffect(() => {
    if (companyData) {
      const initial: Record<string, { history: string; mission: string; vision: string }> = {};

      activeLanguages.forEach((lang) => {
        const trans = companyData.getTranslation(lang.code);
        initial[lang.code] = {
          history: trans.history || "",
          mission: trans.mission || "",
          vision: trans.vision || "",
        };
      });

      setTranslationsState(initial);
    }
  }, [companyData, languagesData]);

  const handleFieldChange = (langCode: string, field: "history" | "mission" | "vision", value: string) => {
    setTranslationsState((prev) => ({
      ...prev,
      [langCode]: {
        ...(prev[langCode] || { history: "", mission: "", vision: "" }),
        [field]: value,
      },
    }));
  };

  // Saves ALL languages in one batch mutation (triggers 1 single toast)
  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canManage) return;

    const payload = activeLanguages.map((lang) => {
      const fields = translationsState[lang.code] || { history: "", mission: "", vision: "" };
      return {
        language_code: lang.code,
        history: fields.history,
        mission: fields.mission,
        vision: fields.vision,
      };
    });

    await updateBatchMutation.mutateAsync(payload);
  };

  if (isDataLoading || isLangsLoading) {
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

  const currentLangObj = activeLanguages.find((l) => l.code === activeLang) || activeLanguages[0];
  const currentFields = translationsState[currentLangObj.code] || { history: "", mission: "", vision: "" };

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
            {/* Language Tabs dynamically loaded from DB */}
            <Tabs value={activeLang} onValueChange={setActiveLang}>
              <TabsList className="flex h-9 p-1 bg-muted/60 border rounded-lg shadow-xs">
                {activeLanguages.map((lang) => (
                  <TabsTrigger
                    key={lang.code}
                    value={lang.code}
                    className="gap-1.5 px-3 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-xs"
                  >
                    <span className="text-sm leading-none">{lang.flag}</span> {lang.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* TOP HEADER SAVE BUTTON */}
            {canManage && (
              <Button
                type="button"
                onClick={() => handleSaveAll()}
                disabled={updateBatchMutation.isPending}
                className="gap-2 shrink-0 h-9"
              >
                {updateBatchMutation.isPending ? (
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
        <form onSubmit={handleSaveAll} className="space-y-6" dir={currentLangObj.dir}>
          {/* History */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <HistoryIcon className="h-4 w-4 text-blue-600" />
              Company History ({currentLangObj.name})
            </Label>
            <Textarea
              value={currentFields.history}
              onChange={(e) => handleFieldChange(currentLangObj.code, "history", e.target.value)}
              placeholder={`Enter company history and founding story in ${currentLangObj.name}...`}
              rows={5}
              disabled={!canManage}
              className="resize-y"
            />
          </div>

          {/* Mission */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-600" />
              Company Mission ({currentLangObj.name})
            </Label>
            <Textarea
              value={currentFields.mission}
              onChange={(e) => handleFieldChange(currentLangObj.code, "mission", e.target.value)}
              placeholder={`Enter core mission statement in ${currentLangObj.name}...`}
              rows={4}
              disabled={!canManage}
              className="resize-y"
            />
          </div>

          {/* Vision */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Eye className="h-4 w-4 text-violet-600" />
              Company Vision ({currentLangObj.name})
            </Label>
            <Textarea
              value={currentFields.vision}
              onChange={(e) => handleFieldChange(currentLangObj.code, "vision", e.target.value)}
              placeholder={`Enter long-term vision statement in ${currentLangObj.name}...`}
              rows={4}
              disabled={!canManage}
              className="resize-y"
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
