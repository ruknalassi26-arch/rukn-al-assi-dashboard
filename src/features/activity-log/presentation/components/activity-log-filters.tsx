"use client";
// ==============================================================================
// features/activity-log/presentation/components/activity-log-filters.tsx
// Search, Action, Entity Type & Date Filters for Activity Logs
// ==============================================================================
import { Search, RotateCcw, Filter, Calendar } from "lucide-react";
import { Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui";
import { useActivityLogStore } from "../stores/activity-log.store";

const ACTIONS = [
  { value: "all", label: "All Actions" },
  { value: "login", label: "Login" },
  { value: "logout", label: "Logout" },
  { value: "created", label: "Create" },
  { value: "updated", label: "Update" },
  { value: "deleted", label: "Delete" },
  { value: "password_changed", label: "Password Change" },
  { value: "seo_updated", label: "SEO Update" },
  { value: "settings_updated", label: "Settings Update" },
  { value: "rfq_status_changed", label: "RFQ Status Change" },
  { value: "contact_updated", label: "Contact Update" },
];

const ENTITY_TYPES = [
  { value: "all", label: "All Entities" },
  { value: "product", label: "Products" },
  { value: "category", label: "Categories" },
  { value: "service", label: "Services" },
  { value: "project", label: "Projects" },
  { value: "certificate", label: "Certificates" },
  { value: "team", label: "Team Members" },
  { value: "rfq", label: "RFQ Requests" },
  { value: "contact", label: "Contact Messages" },
  { value: "homepage", label: "Homepage" },
  { value: "settings", label: "Website Settings" },
  { value: "seo", label: "SEO Settings" },
  { value: "auth", label: "Auth & Profile" },
];

export function ActivityLogFilters() {
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
        <span className="text-xs font-semibold text-foreground">Filter & Search Logs</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search email, title, action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9 text-xs h-9"
          />
        </div>

        {/* Action Select */}
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger className="text-xs h-9">
            <SelectValue placeholder="Select Action" />
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
          <SelectTrigger className="text-xs h-9">
            <SelectValue placeholder="Select Entity" />
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
        <div className="relative">
          <Calendar className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="ps-9 text-xs h-9"
          />
        </div>

        {/* End Date */}
        <div className="relative">
          <Calendar className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="ps-9 text-xs h-9"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-8"
          >
            <RotateCcw className="h-3 w-3" />
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
