"use client";
// ==============================================================================
// features/global-search/presentation/components/global-search-trigger.tsx
// Header Search Trigger Button with Ctrl+K shortcut badge
// ==============================================================================
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@shared/ui";
import { useGlobalSearchStore } from "../stores/global-search.store";

export function GlobalSearchTrigger() {
  const t = useTranslations("header");
  const openModal = useGlobalSearchStore((s) => s.openModal);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={openModal}
      className="relative flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground h-9 px-3 w-40 sm:w-60 justify-between bg-muted/30 border-muted"
    >
      <div className="flex items-center gap-2 truncate">
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{t("searchPlaceholder")}</span>
      </div>

      <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
        <span className="text-[9px]">⌘</span>K
      </kbd>
    </Button>
  );
}
