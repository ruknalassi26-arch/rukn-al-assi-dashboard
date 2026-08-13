"use client";
// ==============================================================================
// features/activity-log/presentation/components/activity-log-filters.tsx
// Search, Action, Entity Type & Date Filters for Activity Logs
// ==============================================================================
import { useTranslations } from "next-intl";
import { Search, RotateCcw, Filter, Calendar } from "lucide-react";
import { Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui";
import { useActivityLogStore } from "../stores/activity-log.store";

export function ActivityLogFilters() {
  const t = useTranslations("activityLog");
  const tCommon = useTranslations("common");

  const ACTIONS = [
    { value: "all", label: t("allActions") },
    { value: "login", label: t("actions.login") },
    { value: "logout", label: t("actions.logout") },
    { value: "created", label: t("actions.created") },
    { value: "updated", label: t("actions.updated") },
    { value: "deleted", label: t("actions.deleted") },
    { value: "password_changed", label: t("actions.password_changed") },
    { value: "seo_updated", label: t("actions.seo_updated") },
    { value: "settings_updated", label: t("actions.settings_updated") },
    { value: "rfq_status_changed", label: t("actions.rfq_status_changed") },
    { value: "contact_updated", label: t("actions.contact_updated") },
  ];

  const ENTITY_TYPES = [
    { value: "all", label: t("allEntities") },
    { value: "product", label: t("entities.product") },
    { value: "category", label: t("entities.category") },
    { value: "service", label: t("entities.service") },
    { value: "project", label: t("entities.project") },
    { value: "certificate", label: t("entities.certificate") },
    { value: "team", label: t("entities.team") },
    { value: "rfq", label: t("entities.rfq") },
    { value: "contact", label: t("entities.contact") },
    { value: "homepage", label: t("entities.homepage") },
    { value: "settings", label: t("entities.settings") },
    { value: "seo", label: t("entities.seo") },
  ];

  const {
    search,
    action,
    entityType,
    startDate,
    endDate,
    setSearch,
    setAction,
    setEntityType,
    setStartDate,
    setEndDate,
    resetFilters,
  } = useActivityLogStore();

  const hasActiveFilters =
    search !== "" || action !== "all" || entityType !== "all" || startDate !== "" || endDate !== "";

  return (
    <div className="space-y-3 p-4 bg-card border rounded-xl shadow-xs">
      <div className="flex items-center gap-2 pb-1 border-b">
        <Filter className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">{tCommon("filter")}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 items-center">
        {/* Search */}
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9 text-xs h-9 w-full"
          />
        </div>

        {/* Action Select */}
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger className="text-xs h-9 w-full">
            <SelectValue placeholder={t("allActions")} />
          </SelectTrigger>
          <SelectContent>
            {ACTIONS.map((item) => (
              <SelectItem key={item.value} value={item.value} className="text-xs">
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Entity Type Select */}
        <Select value={entityType} onValueChange={setEntityType}>
          <SelectTrigger className="text-xs h-9 w-full">
            <SelectValue placeholder={t("allEntities")} />
          </SelectTrigger>
          <SelectContent>
            {ENTITY_TYPES.map((item) => (
              <SelectItem key={item.value} value={item.value} className="text-xs">
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Start Date */}
        <div className="relative w-full">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-xs h-9 px-3 w-full"
            aria-label="Start Date"
          />
        </div>

        {/* End Date */}
        <div className="relative w-full">
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="text-xs h-9 px-3 w-full"
            aria-label="End Date"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="pt-2 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{tCommon("resetFilters")}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
