"use client";
// ==============================================================================
// features/homepage/presentation/pages/homepage-page.tsx
// Homepage Management Page Component
// ==============================================================================
import { useTranslations } from "next-intl";
import {
  Layers,
  FileText,
  BarChart3,
  Wrench,
  Package,
  FolderKanban,
  Users,
  Award,
  MessageSquare,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@shared/ui";
import { ErrorBoundary } from "@shared/components/error-boundary";
import { useHomepageStore, type HomepageTab } from "../stores/homepage.store";
import {
  HeroSectionManager,
  AboutSectionManager,
  StatsSectionManager,
  FeaturedServicesManager,
  FeaturedProductsManager,
  FeaturedProjectsManager,
  ClientsSectionManager,
  CertificatesSectionManager,
  ContactCtaManager,
} from "../components";

export function HomepagePage() {
  const t = useTranslations("homepageAdmin");
  const { activeTab, setActiveTab } = useHomepageStore();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Navigation Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as HomepageTab)}
        className="space-y-6"
      >
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-card p-1.5 border rounded-xl shadow-sm">
          <TabsTrigger value="hero" className="gap-2 py-2 px-3 text-xs">
            <Layers className="h-4 w-4 text-blue-600" />
            {t("tabs.hero")}
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-2 py-2 px-3 text-xs">
            <FileText className="h-4 w-4 text-emerald-600" />
            {t("tabs.about")}
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2 py-2 px-3 text-xs">
            <BarChart3 className="h-4 w-4 text-amber-600" />
            {t("tabs.stats")}
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2 py-2 px-3 text-xs">
            <Wrench className="h-4 w-4 text-violet-600" />
            {t("tabs.services")}
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-2 py-2 px-3 text-xs">
            <Package className="h-4 w-4 text-purple-600" />
            {t("tabs.products")}
          </TabsTrigger>
          <TabsTrigger value="projects" className="gap-2 py-2 px-3 text-xs">
            <FolderKanban className="h-4 w-4 text-indigo-600" />
            {t("tabs.projects")}
          </TabsTrigger>
          <TabsTrigger value="clients" className="gap-2 py-2 px-3 text-xs">
            <Users className="h-4 w-4 text-pink-600" />
            {t("tabs.clients")}
          </TabsTrigger>
          <TabsTrigger value="certificates" className="gap-2 py-2 px-3 text-xs">
            <Award className="h-4 w-4 text-teal-600" />
            {t("tabs.certificates")}
          </TabsTrigger>
          <TabsTrigger value="contact_cta" className="gap-2 py-2 px-3 text-xs">
            <MessageSquare className="h-4 w-4 text-rose-600" />
            {t("tabs.contactCta")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <ErrorBoundary><HeroSectionManager /></ErrorBoundary>
        </TabsContent>
        <TabsContent value="about">
          <ErrorBoundary><AboutSectionManager /></ErrorBoundary>
        </TabsContent>
        <TabsContent value="stats">
          <ErrorBoundary><StatsSectionManager /></ErrorBoundary>
        </TabsContent>
        <TabsContent value="services">
          <ErrorBoundary><FeaturedServicesManager /></ErrorBoundary>
        </TabsContent>
        <TabsContent value="products">
          <ErrorBoundary><FeaturedProductsManager /></ErrorBoundary>
        </TabsContent>
        <TabsContent value="projects">
          <ErrorBoundary><FeaturedProjectsManager /></ErrorBoundary>
        </TabsContent>
        <TabsContent value="clients">
          <ErrorBoundary><ClientsSectionManager /></ErrorBoundary>
        </TabsContent>
        <TabsContent value="certificates">
          <ErrorBoundary><CertificatesSectionManager /></ErrorBoundary>
        </TabsContent>
        <TabsContent value="contact_cta">
          <ErrorBoundary><ContactCtaManager /></ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
}
