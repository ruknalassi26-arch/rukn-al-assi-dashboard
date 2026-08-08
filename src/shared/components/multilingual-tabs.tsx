"use client";
// ==============================================================================
// shared/components/multilingual-tabs.tsx
// Reusable Enterprise Multilingual Form Tabs (English 🇺🇸 | العربية 🇸🇦 | کوردی ☀️ ckb)
// ==============================================================================
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@shared/ui";

interface MultilingualTabsProps {
  englishFields: React.ReactNode;
  arabicFields: React.ReactNode;
  kurdishFields?: React.ReactNode;
  className?: string;
  defaultLanguage?: "en" | "ar" | "ckb" | "ku";
}

export function MultilingualTabs({
  englishFields,
  arabicFields,
  kurdishFields,
  className = "",
  defaultLanguage = "en",
}: MultilingualTabsProps) {
  const [lang, setLang] = useState<"en" | "ar" | "ckb" | "ku">(defaultLanguage);
  const hasKurdish = !!kurdishFields;

  return (
    <Tabs value={lang} onValueChange={(val) => setLang(val as "en" | "ar" | "ckb" | "ku")} className={`space-y-4 ${className}`}>
      <TabsList className={`grid w-full ${hasKurdish ? "grid-cols-3 max-w-[400px]" : "grid-cols-2 max-w-[280px]"} h-9 p-1 bg-muted/60 border rounded-lg shadow-xs`}>
        <TabsTrigger value="en" className="gap-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-xs">
          <span className="text-base leading-none">🇺🇸</span> English
        </TabsTrigger>
        <TabsTrigger value="ar" className="gap-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-xs">
          <span className="text-base leading-none">🇮🇶</span> العربية
        </TabsTrigger>
        {hasKurdish && (
          <TabsTrigger value="ckb" className="gap-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-xs">
            <span className="text-base leading-none">☀️</span> کوردی
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="en" className="space-y-4 focus-visible:outline-none">
        {englishFields}
      </TabsContent>

      <TabsContent value="ar" className="space-y-4 focus-visible:outline-none">
        {arabicFields}
      </TabsContent>

      {hasKurdish && (
        <TabsContent value="ckb" className="space-y-4 focus-visible:outline-none">
          {kurdishFields}
        </TabsContent>
      )}

      {hasKurdish && (
        <TabsContent value="ku" className="space-y-4 focus-visible:outline-none">
          {kurdishFields}
        </TabsContent>
      )}
    </Tabs>
  );
}
