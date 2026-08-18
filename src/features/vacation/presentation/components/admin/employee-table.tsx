"use client";
// ==============================================================================
// features/vacation/presentation/components/admin/employee-table.tsx
// Table for viewing and managing employee profiles with pagination & filtering
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
import { Search, Mail, Phone, Building2, Briefcase, Calendar, Eye } from "lucide-react";
import { DataTablePagination } from "@shared/components";
import { useTranslations } from "next-intl";
import type { EmployeeProfileEntity } from "../../../domain/entities/employee.entity";
import { EmployeeDetailDialog } from "./employee-detail-dialog";

interface EmployeeTableProps {
  employees: EmployeeProfileEntity[];
  isLoading: boolean;
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

export function EmployeeTable({ employees, isLoading }: EmployeeTableProps) {
  const t = useTranslations("employees");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProfileEntity | null>(null);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const filtered = employees.filter((emp) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    const name = (emp.fullName || "").toLowerCase();
    const email = (emp.email || "").toLowerCase();
    const dept = (emp.department || "").toLowerCase();
    const job = (emp.jobTitle || "").toLowerCase();
    return name.includes(q) || email.includes(q) || dept.includes(q) || job.includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedEmployees = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-card p-3 rounded-lg border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8 text-xs h-8"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {t("totalEmployees")}: <span className="font-semibold text-foreground">{employees.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="text-xs font-semibold">{t("table.employee")}</TableHead>
              <TableHead className="text-xs font-semibold">{t("table.departmentJob")}</TableHead>
              <TableHead className="text-xs font-semibold">{t("table.contactInfo")}</TableHead>
              <TableHead className="text-xs font-semibold">{t("table.startDate")}</TableHead>
              <TableHead className="text-xs font-semibold">{t("table.status")}</TableHead>
              <TableHead className="text-xs font-semibold text-end">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6} className="py-3">
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                  {t("noEmployeesFound")}
                </TableCell>
              </TableRow>
            ) : (
              paginatedEmployees.map((emp) => (
                <TableRow key={emp.id} className="hover:bg-muted/30 transition-colors">
                  {/* Profile & Name */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded-full border">
                        <AvatarImage src={emp.avatarUrl || ""} />
                        <AvatarFallback className="text-xs font-bold">
                          {emp.fullName ? emp.fullName.substring(0, 2).toUpperCase() : "EM"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-foreground">
                          {emp.fullName}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {emp.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Department & Job Title */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5 text-xs">
                      {emp.department && (
                        <div className="flex items-center gap-1 text-foreground font-medium">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <span>{emp.department}</span>
                        </div>
                      )}
                      {emp.jobTitle && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Briefcase className="h-3 w-3" />
                          <span>{emp.jobTitle}</span>
                        </div>
                      )}
                      {!emp.department && !emp.jobTitle && (
                        <span className="text-muted-foreground text-[11px]">—</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Phone */}
                  <TableCell className="text-xs">
                    {emp.phone ? (
                      <div className="flex items-center gap-1 text-foreground font-mono text-[11px]">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{emp.phone}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-[11px]">—</span>
                    )}
                  </TableCell>

                  {/* Start Date */}
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {emp.employmentStartDate ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDisplayDate(emp.employmentStartDate)}</span>
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {emp.isActive ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px]">
                        {t("active")}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground text-[10px]">
                        {t("inactive")}
                      </Badge>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => setSelectedEmployee(emp)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {t("details")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
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

      {/* Employee Details Modal */}
      <EmployeeDetailDialog
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        employee={selectedEmployee}
      />
    </div>
  );
}
