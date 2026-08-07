"use client";
// ==============================================================================
// features/careers/presentation/components/job-postings-table.tsx
// Professional Admin Data Table for Job Postings
// ==============================================================================
import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Archive,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Calendar,
  MapPin,
  Building,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Skeleton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/ui";
import {
  useJobPostings,
  useDeleteJobPosting,
  useUpdateJobPostingStatus,
} from "@shared/hooks/careers/use-career-hooks";
import type { JobPostingEntity } from "../../domain/entities/career.entity";
import type { JobPostingStatus, EmploymentType } from "../../domain/enums/career.enum";

export function JobPostingsTable() {
  const locale = useLocale();
  const t = useTranslations("careersAdmin");
  const tCommon = useTranslations("common");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobPostingStatus | "all">("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, refetch } = useJobPostings({
    search,
    status: statusFilter,
    limit,
    offset: (page - 1) * limit,
  });

  const deleteMutation = useDeleteJobPosting();
  const statusMutation = useUpdateJobPostingStatus();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deletingId) return;
    await deleteMutation.mutateAsync(deletingId);
    setDeletingId(null);
  };

  const handleStatusChange = async (id: string, status: JobPostingStatus) => {
    await statusMutation.mutateAsync({ id, status });
  };

  const getTitle = (item: JobPostingEntity) => {
    if (locale === "ar") return item.titleAr || item.titleEn;
    if (locale === "ckb") return item.titleKu || item.titleEn;
    return item.titleEn;
  };

  const getStatusBadge = (status: JobPostingStatus) => {
    switch (status) {
      case "published":
        return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/30">{t("postingStatus.published")}</Badge>;
      case "draft":
        return <Badge variant="secondary">{t("postingStatus.draft")}</Badge>;
      case "archived":
        return <Badge variant="outline" className="text-muted-foreground">{t("postingStatus.archived")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEmploymentTypeBadge = (type: EmploymentType) => {
    switch (type) {
      case "full_time":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/20">{t("types.full_time")}</Badge>;
      case "part_time":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-700 border-purple-500/20">{t("types.part_time")}</Badge>;
      case "contract":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20">{t("types.contract")}</Badge>;
      case "internship":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">{t("types.internship")}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const totalPages = Math.ceil((data?.total ?? 0) / limit);

  return (
    <div className="space-y-4">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`${tCommon("search")}...`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(val: JobPostingStatus | "all") => {
              setStatusFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={tCommon("status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tCommon("all")}</SelectItem>
              <SelectItem value="published">{t("postingStatus.published")}</SelectItem>
              <SelectItem value="draft">{t("postingStatus.draft")}</SelectItem>
              <SelectItem value="archived">{t("postingStatus.archived")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button asChild className="w-full sm:w-auto gap-2">
          <Link href={`/${locale}/admin/careers/postings/new`}>
            <Plus className="h-4 w-4" />
            {t("addPosting")}
          </Link>
        </Button>
      </div>

      {/* Main Table */}
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("table.title")}</TableHead>
              <TableHead>{t("table.department")}</TableHead>
              <TableHead>{t("table.type")}</TableHead>
              <TableHead>{t("table.location")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead>{t("table.closingDate")}</TableHead>
              <TableHead className="text-center">{t("table.sortOrder")}</TableHead>
              <TableHead className="text-end">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-8 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-destructive">
                  Failed to load job postings. <Button variant="link" onClick={() => refetch()}>Try Again</Button>
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Briefcase className="h-10 w-10 text-muted-foreground/50" />
                    <p className="font-medium text-base">No job postings found</p>
                    <p className="text-xs">Create your first job vacancy posting using the button above.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((posting) => (
                <TableRow key={posting.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-semibold text-foreground">
                    <div className="flex flex-col">
                      <span>{getTitle(posting)}</span>
                      <span className="text-xs font-normal text-muted-foreground font-mono">/{posting.slug}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Building className="h-3.5 w-3.5 shrink-0" />
                      <span>{posting.department || "General"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getEmploymentTypeBadge(posting.employmentType)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{posting.location || "On-site"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(posting.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <span>{posting.closingDate ? new Date(posting.closingDate).toLocaleDateString() : "Open"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs">{posting.sortOrder}</TableCell>
                  <TableCell className="text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/${locale}/careers/${posting.slug}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" /> View Public Page
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/${locale}/admin/careers/postings/${posting.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> {tCommon("edit")}
                          </Link>
                        </DropdownMenuItem>
                        {posting.status !== "published" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(posting.id, "published")}>
                            <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" /> Publish
                          </DropdownMenuItem>
                        )}
                        {posting.status !== "archived" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(posting.id, "archived")}>
                            <Archive className="mr-2 h-4 w-4 text-amber-600" /> Archive
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => setDeletingId(posting.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> {tCommon("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            {tCommon("showing")} {data?.data.length} {tCommon("of")} {data?.total} {tCommon("items")}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium">
              {tCommon("page")} {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open: boolean) => !open && setDeletingId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. It will permanently remove this job posting and its public view.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setDeletingId(null)}>
              {tCommon("cancel")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {tCommon("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
