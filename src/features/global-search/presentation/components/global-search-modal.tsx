"use client";
// ==============================================================================
// features/global-search/presentation/components/global-search-modal.tsx
// Global Command Palette Search Modal with Ctrl+K Listener & Highlights
// ==============================================================================
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Button,
  Badge,
  Skeleton,
  ScrollArea,
} from "@shared/ui";
import {
  Search,
  X,
  History,
  Trash2,
  Package,
  FolderKanban,
  Wrench,
  FolderOpen,
  ShieldCheck,
  Users,
  FileText,
  Mail,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useGlobalSearchStore } from "../stores/global-search.store";
import { useGlobalSearchQuery } from "@shared/hooks/global-search/use-global-search-hooks";
import { TextHighlighter } from "./text-highlighter";
import type { SearchModuleType } from "../../domain/entities/global-search.entity";

export function GlobalSearchModal() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("globalSearch");

  const {
    isOpen,
    query,
    moduleFilter,
    page,
    recentSearches,
    openModal,
    closeModal,
    setQuery,
    setModuleFilter,
    setPage,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useGlobalSearchStore();

  const MODULE_TABS = [
    { value: "all", label: t("tabs.all") },
    { value: "products", label: t("tabs.products") },
    { value: "categories", label: t("tabs.categories") },
    { value: "services", label: t("tabs.services") },
    { value: "projects", label: t("tabs.projects") },
    { value: "certificates", label: t("tabs.certificates") },
    { value: "team", label: t("tabs.team") },
    { value: "rfq", label: t("tabs.rfq") },
    { value: "contact", label: t("tabs.contact") },
  ];

  // Global Ctrl+K / Cmd+K Hotkey Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        if (isOpen) {
          closeModal();
        } else {
          openModal();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, openModal, closeModal]);

  const { data, isLoading } = useGlobalSearchQuery(query, moduleFilter, page, 10);

  const results = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const moduleCounts = data?.moduleCounts ?? {};

  const handleSelectResult = (link: string) => {
    addRecentSearch(query);
    closeModal();
    router.push(`/${locale}${link}`);
  };

  const getModuleIcon = (module: SearchModuleType) => {
    switch (module) {
      case "products":
        return <Package className="h-4 w-4 text-blue-500" />;
      case "categories":
        return <FolderKanban className="h-4 w-4 text-indigo-500" />;
      case "services":
        return <Wrench className="h-4 w-4 text-cyan-500" />;
      case "projects":
        return <FolderOpen className="h-4 w-4 text-emerald-500" />;
      case "certificates":
        return <ShieldCheck className="h-4 w-4 text-amber-500" />;
      case "team":
        return <Users className="h-4 w-4 text-purple-500" />;
      case "rfq":
        return <FileText className="h-4 w-4 text-orange-500" />;
      case "contact":
        return <Mail className="h-4 w-4 text-rose-500" />;
      default:
        return <Search className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        {/* Input Bar */}
        <div className="relative flex items-center border-b px-4 py-3 bg-card">
          <Search className="h-4 w-4 text-muted-foreground me-3 shrink-0" />
          <Input
            autoFocus
            placeholder={t("placeholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 text-sm shadow-none p-0 h-8"
          />
          {query.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuery("")}
              className="h-6 w-6 text-muted-foreground hover:text-foreground ms-2"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Recent Searches Tags (shown when query is empty) */}
        {query.trim().length === 0 && recentSearches.length > 0 && (
          <div className="p-4 bg-muted/20 border-b space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold flex items-center gap-1.5">
                <History className="h-3.5 w-3.5 text-primary" />
                {t("recentSearches")}
              </span>
              <button
                type="button"
                onClick={clearRecentSearches}
                className="hover:text-destructive text-[11px] flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                <span>{t("clearAll")}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {recentSearches.map((item, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="gap-1.5 cursor-pointer bg-card hover:bg-muted text-xs py-1 px-2.5"
                  onClick={() => setQuery(item)}
                >
                  <span>{item}</span>
                  <X
                    className="h-3 w-3 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentSearch(item);
                    }}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Filter Category Tabs */}
        {query.trim().length > 0 && (
          <div className="flex items-center gap-1 px-4 py-2 bg-muted/40 border-b overflow-x-auto no-scrollbar">
            {MODULE_TABS.map((tab) => {
              const count = moduleCounts[tab.value] ?? 0;
              const isSelected = moduleFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setModuleFilter(tab.value)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Results Stream Area */}
        <ScrollArea className="flex-1 p-4">
          {query.trim().length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Search className="h-8 w-8 mx-auto text-muted-foreground/40" />
              <p className="text-xs font-semibold text-muted-foreground">{t("emptySearchTitle")}</p>
              <p className="text-[11px] text-muted-foreground/80">
                {t("emptySearchDesc")}
              </p>
            </div>
          ) : isLoading ? (
            <div className="space-y-3 py-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3 border rounded-lg flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 space-y-2 border border-dashed rounded-lg bg-muted/20">
              <Search className="h-8 w-8 mx-auto text-muted-foreground/40" />
              <p className="text-xs font-semibold text-muted-foreground">{t("noResultsTitle")} "{query}"</p>
              <p className="text-[11px] text-muted-foreground/80">
                {t("noResultsDesc")}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((item) => (
                <div
                  key={`${item.module}-${item.id}`}
                  onClick={() => handleSelectResult(item.link)}
                  className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors flex items-start justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-lg bg-muted shrink-0 mt-0.5 border">
                      {getModuleIcon(item.module)}
                    </div>

                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <TextHighlighter
                          text={item.title}
                          query={query}
                          className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate"
                        />
                        <Badge variant="outline" className="text-[10px] uppercase font-semibold shrink-0">
                          {item.moduleLabel}
                        </Badge>
                      </div>

                      {item.description && (
                        <TextHighlighter
                          text={item.description}
                          query={query}
                          className="text-[11px] text-muted-foreground line-clamp-1 block"
                        />
                      )}
                    </div>
                  </div>

                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer Pagination */}
        {query.trim().length > 0 && total > 0 && (
          <div className="p-3 border-t bg-card flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              {t("foundResults", { total })}
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="h-7 w-7"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-[11px] font-semibold px-2">
                {page} / {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="h-7 w-7"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
