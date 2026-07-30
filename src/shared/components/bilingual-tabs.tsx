"use client";
// ==============================================================================
// shared/components/bilingual-tabs.tsx
// Reusable Enterprise Bilingual Form Tabs (English 🇺🇸 | العربية 🇸🇦)
// ==============================================================================
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@shared/ui";

interface BilingualTabsProps {
  englishFields: React.ReactNode;
  arabicFields: React.ReactNode;
  className?: string;
  defaultLanguage?: "en" | "ar";
}

export function BilingualTabs({
  englishFields,
  arabicFields,
  className = "",
  defaultLanguage = "en",
}: BilingualTabsProps) {
  const [lang, setLang] = useState<"en" | "ar">(defaultLanguage);

  return (
    <Tabs value={lang} onValueChange={(val) => setLang(val as "en" | "ar")} className={`space-y-4 ${className}`}>
      <TabsList className="grid w-full grid-cols-2 max-w-[280px] h-9 p-1 bg-muted/60 border rounded-lg shadow-xs">
        <TabsTrigger value="en" className="gap-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-xs">
          <span className="text-base leading-none">🇺🇸</span> English
        </TabsTrigger>
        <TabsTrigger value="ar" className="gap-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-xs">
          <span className="text-base leading-none">🇸🇦</span> العربية
        </TabsTrigger>
      </TabsList>

      <TabsContent value="en" className="space-y-4 focus-visible:outline-none">
        {englishFields}
      </TabsContent>

      <TabsContent value="ar" className="space-y-4 focus-visible:outline-none" dir="rtl">
        {arabicFields}
      </TabsContent>
    </Tabs>
  );
}
