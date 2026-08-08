"use client";
// ==============================================================================
// features/seo/presentation/components/google-search-preview.tsx
// Interactive Real-Time Google Search Result Preview Component
// ==============================================================================
import React from "react";
import { useTranslations } from "next-intl";
import { Search, Globe, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@shared/ui";
import { SEO_PAGE_LABELS } from "../../domain/enums/seo.enums";
import type { SeoPageKey } from "../../domain/entities/seo-setting.entity";

interface GoogleSearchPreviewProps {
  pageKey: SeoPageKey;
  title: string;
  description: string;
  isIndexed: boolean;
}

export function GoogleSearchPreview({
  pageKey,
  title,
  description,
  isIndexed,
}: GoogleSearchPreviewProps) {
  const tCommon = useTranslations("common");
  const pageMeta = SEO_PAGE_LABELS[pageKey] ?? { label: "Page", urlPath: "/" };
  const displayUrl = `https://www.ruknalassi.com${pageMeta.urlPath === "/" ? "" : pageMeta.urlPath}`;

  const previewTitle = title.trim() || `Rukn Al Assi | ${pageMeta.label}`;
  const previewDesc =
    description.trim() ||
    `Official website metadata for Rukn Al Assi hydraulic engineering and industrial equipment.`;

  return (
    <Card className="border shadow-xs bg-background">
      <CardHeader className="pb-3 border-b bg-muted/20">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-blue-600" />
            <span>{tCommon("liveGooglePreview")}</span>
          </div>
          <Badge variant={isIndexed ? "default" : "destructive"} className="text-[10px]">
            {isIndexed ? "Index (Searchable)" : "No Index (Hidden)"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-2 font-sans">
        {/* Google Result Header */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted border text-[10px]">
            <Globe className="h-3 w-3 text-emerald-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-[13px] leading-none">Rukn Al Assi</span>
            <span className="text-[11px] text-muted-foreground truncate max-w-xs">{displayUrl}</span>
          </div>
        </div>

        {/* Google SERP Title */}
        <h3 className="text-lg font-semibold text-blue-700 hover:underline cursor-pointer truncate leading-snug">
          {previewTitle}
        </h3>

        {/* Google SERP Snippet Description */}
        <p className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed max-w-xl">
          {previewDesc}
        </p>

        {!isIndexed && (
          <div className="mt-2 text-[11px] font-semibold text-destructive flex items-center gap-1 bg-destructive/10 p-2 rounded">
            <ShieldCheck className="h-3.5 w-3.5" />
            Note: This page is currently set to NOINDEX. Search engines will not index this page in search results.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
