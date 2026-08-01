"use client";
// ==============================================================================
// features/projects/presentation/components/project-filters.tsx
// Search & Filter Toolbar for Projects List
// ==============================================================================
import { useTranslations } from "next-intl";
import { Search, RotateCcw } from "lucide-react";
import { useLocale } from "next-intl";
import { Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui";
import { useProjectsStore } from "../stores/projects.store";
import { useCategories } from "@shared/hooks/categories/use-category-hooks";

export function ProjectFilters() {
  const locale = useLocale();
  const tCommon = useTranslations("common");
  const tProjects = useTranslations("projects");

  const {
    search,
    categoryId,
    status,
    isFeatured,
    setSearch,
    setCategoryId,
    setStatus,
    setIsFeatured,
    resetFilters,
  } = useProjectsStore();

  const { data: categoriesData } = useCategories({ limit: 100 });
  const categories = categoriesData?.items ?? [];

  const hasActiveFilters =
    search.trim().length > 0 ||
    categoryId !== "all" ||
    status !== "all" ||
    isFeatured !== undefined;

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-card border rounded-xl shadow-xs">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1 sm:flex-initial sm:w-64">
          <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={tCommon("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9 h-9 text-xs"
          />
        </div>

        {/* Category Filter */}
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="h-9 w-40 text-xs">
            <SelectValue placeholder={tProjects("form.category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">{tCommon("all")}</SelectItem>
            {categories.map((cat: any) => (
              <SelectItem key={cat.id} value={cat.id} className="text-xs">
                {cat.getLocalizedName ? cat.getLocalizedName(locale) : cat.nameEn || cat.name_en || cat.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-9 w-36 text-xs">
            <SelectValue placeholder={tCommon("status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">{tCommon("all")}</SelectItem>
            <SelectItem value="active" className="text-xs">{tCommon("active")}</SelectItem>
            <SelectItem value="completed" className="text-xs">{tCommon("completed")}</SelectItem>
            <SelectItem value="ongoing" className="text-xs">{tCommon("ongoing")}</SelectItem>
            <SelectItem value="upcoming" className="text-xs">{tCommon("upcoming")}</SelectItem>
            <SelectItem value="draft" className="text-xs">{tCommon("draft")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Featured Filter */}
        <Select
          value={isFeatured === undefined ? "all" : isFeatured ? "featured" : "standard"}
          onValueChange={(val) => {
            if (val === "all") setIsFeatured(undefined);
            else if (val === "featured") setIsFeatured(true);
            else setIsFeatured(false);
          }}
        >
          <SelectTrigger className="h-9 w-36 text-xs">
            <SelectValue placeholder={tProjects("table.featured")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">{tCommon("all")}</SelectItem>
            <SelectItem value="featured" className="text-xs">{tProjects("table.featured")}</SelectItem>
            <SelectItem value="standard" className="text-xs">Standard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="h-9 text-xs text-muted-foreground hover:text-foreground shrink-0 gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{tCommon("resetFilters")}</span>
        </Button>
      )}
    </div>
  );
}
