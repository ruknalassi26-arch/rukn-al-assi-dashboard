"use client";
// ==============================================================================
// features/projects/presentation/components/project-filters.tsx
// Search & Filter Toolbar for Projects List
// ==============================================================================
import { Search, RotateCcw } from "lucide-react";
import { useLocale } from "next-intl";
import { Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui";
import { useProjectsStore } from "../stores/projects.store";
import { useCategories } from "@shared/hooks/categories/use-category-hooks";

export function ProjectFilters() {
  const locale = useLocale();
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
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects by name, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Category Filter */}
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="h-9 w-40 text-xs">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Categories</SelectItem>
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
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
            <SelectItem value="active" className="text-xs">Active</SelectItem>
            <SelectItem value="completed" className="text-xs">Completed</SelectItem>
            <SelectItem value="ongoing" className="text-xs">Ongoing</SelectItem>
            <SelectItem value="upcoming" className="text-xs">Upcoming</SelectItem>
            <SelectItem value="draft" className="text-xs">Draft</SelectItem>
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
            <SelectValue placeholder="All Featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Projects</SelectItem>
            <SelectItem value="featured" className="text-xs">Featured Only</SelectItem>
            <SelectItem value="standard" className="text-xs">Standard Only</SelectItem>
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
          <span>Reset Filters</span>
        </Button>
      )}
    </div>
  );
}
