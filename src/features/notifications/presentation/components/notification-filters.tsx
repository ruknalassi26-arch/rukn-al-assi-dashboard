"use client";
// ==============================================================================
// features/notifications/presentation/components/notification-filters.tsx
// Search, Type & Read Status Filters for Notification Center Page
// ==============================================================================
import { Search, RotateCcw, Filter } from "lucide-react";
import { Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui";
import { useNotificationStore } from "../stores/notification.store";

const NOTIFICATION_TYPES = [
  { value: "all", label: "All Types" },
  { value: "rfq_new", label: "New RFQs" },
  { value: "contact_new", label: "Contact Messages" },
  { value: "system", label: "System Alerts" },
  { value: "email_failure", label: "Email Failures" },
  { value: "admin_login", label: "Admin Logins" },
];

const READ_STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "unread", label: "Unread Only" },
  { value: "read", label: "Read Only" },
];

export function NotificationFilters() {
  const { search, type, readStatus, setSearch, setType, setReadStatus, resetFilters } = useNotificationStore();

  const hasActiveFilters = search !== "" || type !== "all" || readStatus !== "all";

  return (
    <div className="space-y-3 p-4 bg-card border rounded-xl shadow-xs">
      <div className="flex items-center gap-2 pb-1 border-b">
        <Filter className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">Filter Notifications</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9 text-xs h-9"
          />
        </div>

        {/* Type Select */}
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="text-xs h-9">
            <SelectValue placeholder="Select Notification Type" />
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
        <Select value={readStatus} onValueChange={(val) => setReadStatus(val as "all" | "unread" | "read")}>
          <SelectTrigger className="text-xs h-9">
            <SelectValue placeholder="Select Read Status" />
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
        <div className="flex justify-end pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-8"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
