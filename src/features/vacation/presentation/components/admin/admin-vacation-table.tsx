"use client";
// ==============================================================================
// features/vacation/presentation/components/admin/admin-vacation-table.tsx
// Table of Vacation Requests for Admin review and management with pagination & i18n
// ==============================================================================

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Input,
  Skeleton,
} from "@shared/ui";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
  Eye,
} from "lucide-react";
import { DataTablePagination } from "@shared/components";
import { useTranslations } from "next-intl";
import type { VacationRequestEntity } from "../../../domain/entities/vacation.entity";
import { ReviewVacationDialog } from "./review-vacation-dialog";
import { Can } from "@features/roles-permissions/presentation/components";

interface AdminVacationTableProps {
  requests: VacationRequestEntity[];
  isLoading: boolean;
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

const PAGE_SIZE = 10;

function formatDisplayDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function AdminVacationTable({
  requests,
  isLoading,
  activeStatus,
  onStatusChange,
}: AdminVacationTableProps) {
  const t = useTranslations("vacation");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<VacationRequestEntity | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusTabChange = (status: string) => {
    onStatusChange(status);
    setPage(1);
  };

  const filtered = requests.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    const empName = (r.employee?.fullName || "").toLowerCase();
    const empDept = (r.employee?.department || "").toLowerCase();
    const typeName = (typeof r.vacationType === "object" ? r.vacationType?.name : r.vacationType || "").toLowerCase();
    return empName.includes(q) || empDept.includes(q) || typeName.includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedRequests = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 gap-1 text-[11px]">
            <CheckCircle className="h-3 w-3" /> {t("tabs.approved")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1 text-[11px]">
            <XCircle className="h-3 w-3" /> {t("tabs.rejected")}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="secondary" className="gap-1 text-[11px] text-muted-foreground">
            <Ban className="h-3 w-3" /> {t("tabs.cancelled")}
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 gap-1 text-[11px]">
            <Clock className="h-3 w-3" /> {t("tabs.pending")}
          </Badge>
        );
    }
  };

  const statusTabs = [
    { label: t("tabs.all"), value: "all" },
    { label: t("tabs.pending"), value: "pending" },
    { label: t("tabs.approved"), value: "approved" },
    { label: t("tabs.rejected"), value: "rejected" },
    { label: t("tabs.cancelled"), value: "cancelled" },
  ];

  return (
    <div className="space-y-4">
      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-lg border">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {statusTabs.map((tab) => (
            <Button
              key={tab.value}
              variant={activeStatus === tab.value ? "default" : "ghost"}
              size="sm"
              onClick={() => handleStatusTabChange(tab.value)}
              className="text-xs h-8 px-3 shrink-0"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8 text-xs h-8"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="text-xs font-semibold">{t("table.employee")}</TableHead>
              <TableHead className="text-xs font-semibold">{t("table.leaveType")}</TableHead>
              <TableHead className="text-xs font-semibold">{t("table.dates")}</TableHead>
              <TableHead className="text-xs font-semibold text-center">{t("table.days")}</TableHead>
              <TableHead className="text-xs font-semibold">{t("table.returnDate")}</TableHead>
              <TableHead className="text-xs font-semibold">{t("table.status")}</TableHead>
              <TableHead className="text-xs font-semibold text-end">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7} className="py-3">
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                  {t("table.noRequestsFound")}
                </TableCell>
              </TableRow>
            ) : (
              paginatedRequests.map((req) => {
                const leaveTypeName =
                  typeof req.vacationType === "object"
                    ? req.vacationType?.name
                    : req.vacationType || "Vacation";

                return (
                  <TableRow key={req.id} className="hover:bg-muted/30 transition-colors">
                    {/* Employee */}
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 rounded-full border">
                          <AvatarImage src={req.employee?.avatarUrl || ""} />
                          <AvatarFallback className="text-[10px] font-bold">
                            {req.employee?.fullName
                              ? req.employee.fullName.substring(0, 2).toUpperCase()
                              : "EM"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-xs text-foreground">
                            {req.employee?.fullName || "Employee"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {req.employee?.department || req.employee?.email || "—"}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Leave Type */}
                    <TableCell className="text-xs font-medium">
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {leaveTypeName}
                      </Badge>
                    </TableCell>

                    {/* Dates */}
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground font-mono">
                        <span>{formatDisplayDate(req.fromDate)}</span>
                        <span>→</span>
                        <span>{formatDisplayDate(req.toDate)}</span>
                      </div>
                    </TableCell>

                    {/* Days Count */}
                    <TableCell className="text-xs font-bold text-center">
                      {req.requestedDays}
                    </TableCell>

                    {/* Return Date */}
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {formatDisplayDate(req.returnToWorkDate)}
                    </TableCell>

                    {/* Status */}
                    <TableCell>{getStatusBadge(req.status)}</TableCell>

                    {/* Actions */}
                    <TableCell className="text-end">
                      <Can access="vacation:manage">
                        {req.status === "pending" ? (
                          <Button
                            size="sm"
                            variant="default"
                            className="text-xs h-7 px-2.5 gap-1 bg-primary hover:bg-primary/90"
                            onClick={() => {
                              setSelectedRequest(req);
                              setIsReviewOpen(true);
                            }}
                          >
                            {t("table.review")}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7 px-2 text-muted-foreground"
                            onClick={() => {
                              setSelectedRequest(req);
                              setIsReviewOpen(true);
                            }}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" /> {t("table.view")}
                          </Button>
                        )}
                      </Can>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination
        page={page}
        totalPages={totalPages}
        totalItems={filtered.length}
        onPageChange={setPage}
      />

      {/* Review / Details Modal */}
      <ReviewVacationDialog
        isOpen={isReviewOpen}
        onClose={() => {
          setIsReviewOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
      />
    </div>
  );
}
