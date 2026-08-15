"use client";
// ==============================================================================
// features/global-search/presentation/components/global-search-modal.tsx
// Global Command Palette Search Modal with Ctrl+K Listener & Real DB Results
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
  Briefcase,
  MapPin,
  Building2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
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
    closeModal,
    setQuery,
    setModuleFilter,
    setPage,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useGlobalSearchStore();

  const MODULE_TABS = [
    { value: "all", label: t("tabs.all") || "All" },
    { value: "products", label: t("tabs.products") || "Products" },
    { value: "categories", label: t("tabs.categories") || "Categories" },
    { value: "services", label: t("tabs.services") || "Services" },
    { value: "projects", label: t("tabs.projects") || "Projects" },
    { value: "certificates", label: t("tabs.certificates") || "Certificates" },
    { value: "team", label: t("tabs.team") || "Team" },
    { value: "rfq", label: t("tabs.rfq") || "RFQs" },
    { value: "contact", label: t("tabs.contact") || "Contact" },
    { value: "careers", label: "Jobs" },
    { value: "branches", label: "Branches" },
    { value: "clients", label: "Clients" },
  ];

  // Global Ctrl+K / Cmd+K Hotkey Listener (works across English, Arabic, Kurdish keyboard layouts)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key?.toLowerCase() === "k" || e.code === "KeyK")) {
        e.preventDefault();
        useGlobalSearchStore.getState().toggleModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  const { data, isLoading, isFetching, isError } = useGlobalSearchQuery(
    query,
    moduleFilter as SearchModuleType | "all",
    page,
    10,
    isOpen
  );

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
      case "careers":
        return <Briefcase className="h-4 w-4 text-purple-600" />;
      case "branches":
        return <MapPin className="h-4 w-4 text-emerald-600" />;
      case "clients":
        return <Building2 className="h-4 w-4 text-sky-600" />;
      default:
        return <Search className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{t("title") || "Global Search"}</DialogTitle>
        </DialogHeader>

        {/* Input Bar */}
        <div className="relative flex items-center border-b ps-4 pe-14 py-3 bg-card gap-2">
          {isFetching ? (
            <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          <Input
            autoFocus
            placeholder={t("placeholder") || "Search products, categories, services, projects..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 text-sm shadow-none px-2 h-8 flex-1"
          />
          {query.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuery("")}
              title="Clear search query"
              className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0 rounded-full hover:bg-muted"
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
                {t("recentSearches") || "Recent Searches"}
              </span>
              <button
                type="button"
                onClick={clearRecentSearches}
                className="hover:text-destructive text-[11px] flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                <span>{t("clearAll") || "Clear All"}</span>
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
        {query.trim().length >= 2 && (
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
          {query.trim().length < 2 ? (
            <div className="text-center py-12 space-y-2">
              <Search className="h-8 w-8 mx-auto text-muted-foreground/40" />
              <p className="text-xs font-semibold text-muted-foreground">Type at least 2 characters to search</p>
              <p className="text-[11px] text-muted-foreground/80">
                Search across products, projects, services, categories, team members, and RFQs.
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
          ) : isError ? (
            <div className="text-center py-12 space-y-2 border border-destructive/30 rounded-lg bg-destructive/5 text-destructive">
              <p className="text-xs font-semibold">Unable to search. Please try again.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 space-y-2 border border-dashed rounded-lg bg-muted/20">
              <Search className="h-8 w-8 mx-auto text-muted-foreground/40" />
              <p className="text-xs font-semibold text-muted-foreground">No results found for "{query}"</p>
              <p className="text-[11px] text-muted-foreground/80">
                Try refining your keywords or searching in English, Arabic, or Kurdish.
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
        {query.trim().length >= 2 && total > 0 && (
          <div className="p-3 border-t bg-card flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              Found {total} result{total === 1 ? "" : "s"}
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
