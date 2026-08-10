"use client";
// ==============================================================================
// features/about/presentation/components/company-info-manager.tsx
// Management form for Company Information (History, Mission, Vision)
// Strictly matching company_profile & company_profile_translations DB schema
// ==============================================================================
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Save, Globe, History as HistoryIcon, Target, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@shared/ui";
import { useCompanyInfo, useUpdateCompanyInfoTranslation } from "@shared/hooks/about/use-about-hooks";
import { useLanguages } from "@shared/hooks/settings/use-language-hooks";
import { usePermission } from "@features/roles-permissions/presentation/hooks/use-permission";
import { ErrorState } from "@shared/components/error-state";

export function CompanyInfoManager() {
  const t = useTranslations("aboutAdmin.overview");
  const tCommon = useTranslations("common");

  const { hasPermission } = usePermission();
  const canManage = hasPermission("about", "manage");

  const { data: languagesData, isLoading: isLangsLoading } = useLanguages();
  const languages = languagesData ?? [
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" },
    { code: "ckb", name: "کوردی" },
  ];

  const [selectedLang, setSelectedLang] = useState<string>("en");

  const { data: companyData, isLoading: isDataLoading, error, refetch } = useCompanyInfo();
  const updateMutation = useUpdateCompanyInfoTranslation();

  const [history, setHistory] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");

  useEffect(() => {
    if (companyData) {
      const trans = companyData.getTranslation(selectedLang);
      setHistory(trans.history || "");
      setMission(trans.mission || "");
      setVision(trans.vision || "");
    }
  }, [companyData, selectedLang]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;

    await updateMutation.mutateAsync({
      language_code: selectedLang,
      history,
      mission,
      vision,
    });
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

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              Company Profile & Narrative
            </CardTitle>
            <CardDescription className="text-xs">
              Manage Company History, Mission, and Vision across all system languages.
            </CardDescription>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary shrink-0" />
            <Select value={selectedLang} onValueChange={setSelectedLang}>
              <SelectTrigger className="w-[180px] h-9 text-xs">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="text-xs">
                    {lang.name} ({lang.code.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* History */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <HistoryIcon className="h-4 w-4 text-blue-600" />
              Company History ({selectedLang.toUpperCase()})
            </Label>
            <Textarea
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              placeholder="Enter comprehensive company background, founding story, and milestone journey..."
              rows={5}
              disabled={!canManage}
              className="resize-y"
            />
          </div>

          {/* Mission */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-600" />
              Company Mission ({selectedLang.toUpperCase()})
            </Label>
            <Textarea
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              placeholder="Enter the core company mission statement..."
              rows={4}
              disabled={!canManage}
              className="resize-y"
            />
          </div>

          {/* Vision */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Eye className="h-4 w-4 text-violet-600" />
              Company Vision ({selectedLang.toUpperCase()})
            </Label>
            <Textarea
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              placeholder="Enter long-term strategic vision statement..."
              rows={4}
              disabled={!canManage}
              className="resize-y"
            />
          </div>

          {/* Actions */}
          {canManage && (
            <div className="flex justify-end pt-2 border-t">
              <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Information ({selectedLang.toUpperCase()})
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
