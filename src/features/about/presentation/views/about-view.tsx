"use client";
// ==============================================================================
// features/about/presentation/views/about-view.tsx
// Master view for About Us Management with section tab navigation
// ==============================================================================
import { useTranslations } from "next-intl";
import {
  Building,
  Target,
  ShieldCheck,
  History,
  Users,
  Award,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@shared/ui";
import { ErrorBoundary } from "@shared/components/error-boundary";
import { useAboutStore, type AboutTab } from "../stores/about.store";
import {
  CompanyInfoManager,
  MissionVisionManager,
  CoreValuesManager,
  TimelineManager,
  TeamManager,
  CertificatesManager,
} from "../components";

export function AboutView() {
  const t = useTranslations("aboutAdmin");
  const { activeTab, setActiveTab } = useAboutStore();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Tabs navigation */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as AboutTab)}
        className="space-y-6"
      >
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-card p-1.5 border rounded-xl shadow-sm">
          <TabsTrigger value="company_info" className="gap-2 py-2 px-3 text-xs">
            <Building className="h-4 w-4 text-blue-600" />
            {t("tabs.companyInfo")}
          </TabsTrigger>
          <TabsTrigger value="mission_vision" className="gap-2 py-2 px-3 text-xs">
            <Target className="h-4 w-4 text-emerald-600" />
            {t("tabs.missionVision")}
          </TabsTrigger>
          <TabsTrigger value="core_values" className="gap-2 py-2 px-3 text-xs">
            <ShieldCheck className="h-4 w-4 text-amber-600" />
            {t("tabs.coreValues")}
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2 py-2 px-3 text-xs">
            <History className="h-4 w-4 text-violet-600" />
            {t("tabs.timeline")}
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2 py-2 px-3 text-xs">
            <Users className="h-4 w-4 text-rose-600" />
            {t("tabs.team")}
          </TabsTrigger>
          <TabsTrigger value="certificates" className="gap-2 py-2 px-3 text-xs">
            <Award className="h-4 w-4 text-teal-600" />
            {t("tabs.certificates")}
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="company_info">
          <ErrorBoundary>
            <CompanyInfoManager />
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="mission_vision">
          <ErrorBoundary>
            <MissionVisionManager />
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="core_values">
          <ErrorBoundary>
            <CoreValuesManager />
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="timeline">
          <ErrorBoundary>
            <TimelineManager />
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="team">
          <ErrorBoundary>
            <TeamManager />
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="certificates">
          <ErrorBoundary>
            <CertificatesManager />
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
}
