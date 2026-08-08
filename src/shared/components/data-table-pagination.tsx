"use client";
// ==============================================================================
// src/shared/components/data-table-pagination.tsx
// Universal RTL/LTR aware, localized pagination component for data tables
// ==============================================================================
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@shared/ui";
import { useRTL } from "@core/hooks/use-rtl";

interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function DataTablePagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
  className = "",
}: DataTablePaginationProps) {
  const t = useTranslations("common.pagination");
  const isRtl = useRTL();

  if (totalPages <= 1) return null;

  // In RTL mode, Previous points Right (ChevronRight) and Next points Left (ChevronLeft)
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 text-xs text-muted-foreground ${className}`}
    >
      <p>
        {t("showingPage")} <span className="font-semibold text-foreground">{page}</span> {t("of")}{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
        {totalItems !== undefined && (
          <span>
            {" "}
            ({totalItems} {t("total")})
          </span>
        )}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="gap-1.5 h-8 text-xs font-medium"
        >
          <PrevIcon className="h-3.5 w-3.5" />
          {t("previous")}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="gap-1.5 h-8 text-xs font-medium"
        >
          {t("next")}
          <NextIcon className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
