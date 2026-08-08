"use client";
// ==============================================================================
// features/notifications/presentation/components/notification-filters.tsx
// Search, Type & Read Status Filters for Notification Center Page
// ==============================================================================
import { useTranslations } from "next-intl";
import { Search, RotateCcw, Filter } from "lucide-react";
import { Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui";
import { useNotificationStore } from "../stores/notification.store";

export function NotificationFilters() {
  const t = useTranslations("notifications");
  const tCommon = useTranslations("common");
  const { search, type, readStatus, setSearch, setType, setReadStatus, resetFilters } = useNotificationStore();

  const NOTIFICATION_TYPES = [
    { value: "all", label: t("types.all") },
    { value: "rfq_new", label: t("types.rfq") },
    { value: "contact_new", label: t("types.contact") },
    { value: "system", label: t("types.system") },
    { value: "email_failure", label: t("types.email_failure") },
    { value: "admin_login", label: t("types.admin_login") },
  ];

  const READ_STATUSES = [
    { value: "all", label: tCommon("all") },
    { value: "unread", label: t("unreadOnly") },
    { value: "read", label: t("read") },
  ];

  const hasActiveFilters = search !== "" || type !== "all" || readStatus !== "all";

  return (
    <div className="space-y-3 p-4 bg-card border rounded-xl shadow-xs">
      <div className="flex items-center gap-2 pb-1 border-b">
        <Filter className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">{tCommon("filter")}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder={tCommon("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9 text-xs h-9"
          />
        </div>

        {/* Type Select */}
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="text-xs h-9">
            <SelectValue placeholder={tCommon("filter")} />
          </SelectTrigger>
          <SelectContent>
            {NOTIFICATION_TYPES.map((item) => (
              <SelectItem key={item.value} value={item.value} className="text-xs">
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Read Status Select */}
        <Select value={readStatus} onValueChange={setReadStatus}>
          <SelectTrigger className="text-xs h-9">
            <SelectValue placeholder={tCommon("status")} />
          </SelectTrigger>
          <SelectContent>
            {READ_STATUSES.map((item) => (
              <SelectItem key={item.value} value={item.value} className="text-xs">
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
