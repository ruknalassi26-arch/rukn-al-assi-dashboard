"use client";
// ==============================================================================
// features/dashboard/presentation/views/components/latest-contacts-table.tsx
// Latest contact messages table using TanStack Table
// ==============================================================================
import { useMemo } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { Eye, Mail } from "lucide-react";
import { formatDate } from "@core/utils/format";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  Skeleton,
} from "@shared/ui";
import { EmptyState } from "@shared/components";
import { ErrorState } from "@shared/components";
import { useLatestContacts } from "../../hooks";
import type { LatestContactEntity } from "../../../domain/entities/dashboard.entity";

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  new: "destructive",
  read: "secondary",
  replied: "default",
};

export function LatestContactsTable() {
  const locale = useLocale();
  const t = useTranslations("dashboard.contactTable");
  const { data: contacts, isLoading, error, refetch } = useLatestContacts(5);

  const columns = useMemo<ColumnDef<LatestContactEntity>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("name"),
        cell: ({ row }) => (
          <span className="font-medium text-foreground">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "email",
        header: t("email"),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">{row.original.email}</span>
        ),
      },
      {
        accessorKey: "subject",
        header: t("subject"),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs max-w-[200px] truncate block">
            {row.original.subject ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: t("status"),
        cell: ({ row }) => (
          <Badge variant={STATUS_VARIANTS[row.original.status] ?? "outline"}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: t("date"),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDate(row.original.createdAt.toISOString(), locale)}
          </span>
        ),
      },
      {
        id: "actions",
        header: t("actions"),
        cell: ({ row }) => (
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/${locale}/admin/contacts/${row.original.id}`} aria-label={t("view")}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        ),
      },
    ],
    [locale, t]
  );

  const table = useReactTable({
    data: contacts ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-8 w-20" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <ErrorState title={t("errorTitle")} error={error} onRetry={() => refetch()} compact />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Mail className="h-5 w-5 text-cyan-600" />
          {t("title")}
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${locale}/admin/contacts`}>{t("viewAll")}</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {!contacts || contacts.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Mail}
              title={t("emptyTitle")}
              description={t("emptyDescription")}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="whitespace-nowrap text-xs">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
